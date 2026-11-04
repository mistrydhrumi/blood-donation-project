"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import MapboxMap, {
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  Users,
  Droplets,
  MessageCircle,
  Eye,
  Lock,
  X,
} from "lucide-react";
import type { DonorItem } from "./DonorCard";
import {
  geocodeLocation,
  getGeocodeCacheKey,
} from "@/services/mapbox-geocoding.service";

interface DonorLocationGroup {
  key: string;
  latitude: number;
  longitude: number;
  label: string;
  pincode?: string;
  city?: string;
  state?: string;
  donors: DonorItem[];
}

interface DonorMapProps {
  donors: DonorItem[];
  selectedDonor: DonorItem | null;
  onSelectDonor: (donor: DonorItem) => void;
  onViewProfile: (donor: DonorItem) => void;
  onContactWhatsApp: (donor: DonorItem) => void;
  activeCity?: string;
}

const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Default center: Ahmedabad, Gujarat
const DEFAULT_VIEW_STATE = {
  longitude: 72.5714,
  latitude: 23.0225,
  zoom: 11,
};

export function DonorMap({
  donors,
  selectedDonor,
  onSelectDonor,
  onViewProfile,
  onContactWhatsApp,
  activeCity = "Ahmedabad",
}: DonorMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [locationGroups, setLocationGroups] = useState<DonorLocationGroup[]>([]);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(true);
  const [clickedGroupKey, setClickedGroupKey] = useState<string | null>(null);

  // ResizeObserver to ensure the Mapbox WebGL canvas always fits 100% of container dimensions
  useEffect(() => {
    mapRef.current?.resize();

    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 150);

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        mapRef.current?.resize();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      ro?.disconnect();
    };
  }, []);

  // Group donors by their postal/area key
  const groupedDonors = useMemo(() => {
    const map = new Map<string, { donors: DonorItem[]; first: DonorItem }>();

    for (const donor of donors) {
      const key = getGeocodeCacheKey(donor.pincode, donor.city, donor.state);
      const existing = map.get(key);
      if (existing) {
        existing.donors.push(donor);
      } else {
        map.set(key, { donors: [donor], first: donor });
      }
    }

    return map;
  }, [donors]);

  // Geocode location groups into coordinates
  useEffect(() => {
    let isCancelled = false;

    async function geocodeAllGroups() {
      setIsGeocoding(true);

      const resolvedGroups: DonorLocationGroup[] = [];

      const entries = Array.from(groupedDonors.entries());

      await Promise.allSettled(
        entries.map(async ([key, { donors: groupDonors, first }]) => {
          // Check if coordinates already exist on donor profile
          let lat = first.latitude;
          let lng = first.longitude;

          // If no pre-stored coordinates, geocode via Mapbox Search / Places
          if (lat == null || lng == null) {
            const coords = await geocodeLocation(
              first.pincode,
              first.city,
              first.state
            );
            if (coords) {
              lat = coords.latitude;
              lng = coords.longitude;
            }
          }

          if (lat != null && lng != null) {
            const label = first.pincode
              ? `PIN ${first.pincode}, ${first.city}`
              : `${first.city}${first.state ? `, ${first.state}` : ""}`;

            resolvedGroups.push({
              key,
              latitude: lat,
              longitude: lng,
              label,
              pincode: first.pincode,
              city: first.city,
              state: first.state,
              donors: groupDonors,
            });
          }
        })
      );

      if (isCancelled) return;

      setLocationGroups(resolvedGroups);
      setIsGeocoding(false);

      // Fit map bounds to encompass all resolved donor locations
      if (resolvedGroups.length > 0 && mapRef.current) {
        if (resolvedGroups.length === 1) {
          mapRef.current.flyTo({
            center: [resolvedGroups[0].longitude, resolvedGroups[0].latitude],
            zoom: 12,
            duration: 800,
          });
        } else {
          let minLng = Infinity;
          let maxLng = -Infinity;
          let minLat = Infinity;
          let maxLat = -Infinity;

          for (const g of resolvedGroups) {
            if (g.longitude < minLng) minLng = g.longitude;
            if (g.longitude > maxLng) maxLng = g.longitude;
            if (g.latitude < minLat) minLat = g.latitude;
            if (g.latitude > maxLat) maxLat = g.latitude;
          }

          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 80, maxZoom: 13, duration: 800 }
          );
        }
      }
    }

    geocodeAllGroups();

    return () => {
      isCancelled = true;
    };
  }, [groupedDonors]);

  // Camera flyTo animation when selectedDonor changes
  useEffect(() => {
    if (!selectedDonor) return;
    const key = getGeocodeCacheKey(
      selectedDonor.pincode,
      selectedDonor.city,
      selectedDonor.state
    );
    const targetGroup = locationGroups.find((g) => g.key === key);
    if (targetGroup) {
      mapRef.current?.flyTo({
        center: [targetGroup.longitude, targetGroup.latitude],
        zoom: 13,
        duration: 800,
      });
    }
  }, [selectedDonor, locationGroups]);

  // Derived active popup location group
  const activeGroupKey = useMemo(() => {
    if (clickedGroupKey !== null) return clickedGroupKey || null;
    if (selectedDonor) {
      return getGeocodeCacheKey(
        selectedDonor.pincode,
        selectedDonor.city,
        selectedDonor.state
      );
    }
    return null;
  }, [clickedGroupKey, selectedDonor]);

  const activeGroup = useMemo(() => {
    if (!activeGroupKey) return null;
    return locationGroups.find((g) => g.key === activeGroupKey) || null;
  }, [locationGroups, activeGroupKey]);

  if (!token) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p className="text-sm font-semibold text-red-600">
          Mapbox access token is not configured.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs h-[360px] sm:h-[400px] lg:h-[440px]"
    >
      <style>{`
        .donor-map-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 1rem !important;
        }
        .donor-map-popup .mapboxgl-popup-tip {
          border-bottom-color: #fef2f2 !important;
          border-top-color: #ffffff !important;
        }
        .donor-map-popup .mapboxgl-popup-close-button {
          display: none !important;
        }
        .mapboxgl-ctrl-group {
          border-radius: 0.75rem !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Geocoding Loading Pill */}
      {isGeocoding && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-xs px-3.5 py-2 shadow-md border border-gray-100 text-xs font-semibold text-gray-700 animate-in fade-in duration-200">
          <span className="h-3.5 w-3.5 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
          <span>Plotting donor locations on map...</span>
        </div>
      )}

      {/* Mapbox Canvas */}
      <MapboxMap
        ref={mapRef}
        initialViewState={DEFAULT_VIEW_STATE}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={false}
        onLoad={(e) => {
          e.target.resize();
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={true}
          showZoom={true}
          style={{
            marginRight: 16,
            marginBottom: 16,
          }}
        />

        {/* Location Markers */}
        {locationGroups.map((group) => {
          const isSelected = group.key === activeGroupKey;
          const donorCount = group.donors.length;
          const primaryGroup = group.donors[0]?.bloodGroup || "O+";

          return (
            <Marker
              key={group.key}
              latitude={group.latitude}
              longitude={group.longitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setClickedGroupKey(group.key);
                onSelectDonor(group.donors[0]);
              }}
            >
              <button
                type="button"
                className={`group flex items-center gap-1.5 transition-transform duration-150 cursor-pointer ${
                  isSelected ? "scale-115 z-30" : "hover:scale-110 z-10"
                }`}
                aria-label={`Donor location in ${group.label}`}
              >
                {donorCount === 1 ? (
                  /* Single Donor Pin */
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-red-800 text-white border-white ring-4 ring-red-400/40"
                        : "bg-red-700 hover:bg-red-800 text-white border-white"
                    }`}
                  >
                    <Droplets className="w-3 h-3 fill-current" />
                    <span>{primaryGroup}</span>
                  </div>
                ) : (
                  /* Grouped Multi-donor Badge */
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-lg border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gray-900 text-white border-red-500 ring-4 ring-red-400/40"
                        : "bg-red-700 hover:bg-red-800 text-white border-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{donorCount} Donors</span>
                  </div>
                )}
              </button>
            </Marker>
          );
        })}

        {/* Selected Marker Popup */}
        {activeGroup && (
          <Popup
            latitude={activeGroup.latitude}
            longitude={activeGroup.longitude}
            anchor="top"
            offset={14}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setClickedGroupKey("")}
            className="donor-map-popup z-40"
          >
            <div className="w-72 sm:w-80 max-h-[350px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100/80">
              {/* Popup Header with integrated Close Button */}
              <div className="bg-red-50/90 px-3.5 py-3 border-b border-red-100 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-red-900 font-bold text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span className="truncate">{activeGroup.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {activeGroup.donors.length === 1
                      ? "1 Verified Donor in this approximate area"
                      : `${activeGroup.donors.length} Verified Donors in this approximate area`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setClickedGroupKey("")}
                  className="p-1 -mr-1 -mt-0.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-red-100/60 transition-colors shrink-0 cursor-pointer"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Donor List in this Area */}
              <div className="p-3 overflow-y-auto space-y-2.5 divide-y divide-gray-100">
                {activeGroup.donors.map((donor) => (
                  <div key={donor.id} className="pt-2.5 first:pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800 font-bold text-xs">
                          {donor.initials}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900 leading-tight">
                            {donor.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`inline-block h-1.5 w-1.5 rounded-full ${
                                donor.status === "Available"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span className="text-[10px] text-gray-500 font-medium">
                              {donor.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Blood Group Badge */}
                      <span className="shrink-0 rounded-lg bg-red-50 border border-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        type="button"
                        onClick={() => onViewProfile(donor)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-semibold text-gray-700 py-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onContactWhatsApp(donor)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold py-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy Footer */}
              <div className="bg-gray-50/90 px-3 py-2 border-t border-gray-100 text-[10px] text-gray-500 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                <span>Exact address protected for donor privacy.</span>
              </div>
            </div>
          </Popup>
        )}
      </MapboxMap>

      {/* Floating Donors Count Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-xs px-3 py-1.5 shadow-xs border border-gray-200 text-xs font-semibold text-gray-800">
        <Droplets className="w-3.5 h-3.5 text-red-600 fill-red-600" />
        <span>
          {donors.length} {donors.length === 1 ? "donor" : "donors"} near {activeCity}
        </span>
      </div>
    </div>
  );
}

export default DonorMap;
