"use client";

import { useEffect, useState } from "react";
import type { LineString } from "geojson";
import { Spinner } from "@/components/ui/spinner";

import {
  getNearestBloodBanks,
  type BloodBank,
} from "@/services/blood-banks.service";
import Map, {
  NavigationControl,
  Marker,
  useMap,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, LocateFixed, Search, Landmark } from "lucide-react";
import BloodBankCard from "../ui/blood-bank-card";
import { Button } from "../ui/button";
import { fetchRoute } from "@/services/mapbox-directions.service";
type LocationStatus = "idle" | "loading" | "success" | "denied" | "error";
const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function BloodBankMap() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routes, setRoutes] = useState<Record<string, GeoJSON.LineString>>({});

  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [bloodBank, setBloodBank] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const selectedBank = bloodBank?.find((bank) => bank.id === selectedId);
  const [viewState, setViewState] = useState({
    longitude: 72.5714,
    latitude: 23.0225,
    zoom: 11,
  });
  useEffect(() => {
    if (!selectedBank) return;

    setViewState((prev) => ({
      ...prev,
      latitude: selectedBank.latitude,
      longitude: selectedBank.longitude,
      zoom: 14,
    }));
  }, [selectedBank?.id]);
  useEffect(() => {
    requestUserLocation();
  }, []);
  useEffect(() => {
    if (!userLocation) return;

    setViewState((prev) => ({
      ...prev,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      zoom: 15,
    }));
  }, [userLocation]);
  useEffect(() => {
    if (!userLocation || !selectedBank || !token) return;

    const controller = new AbortController();

    async function fetchSelectedRoute() {
      if (!userLocation || !selectedBank || !token) return;

      setRouteLoading(true);
      setRouteError("");

      try {
        const geometry = await fetchRoute({
          userLatitude: userLocation.latitude,
          userLongitude: userLocation.longitude,
          bankLatitude: selectedBank.latitude,
          bankLongitude: selectedBank.longitude,
          token,
          signal: controller.signal,
        });

        setRoutes((prev) => ({
          ...prev,
          [selectedBank.id]: geometry,
        }));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setRouteError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRouteLoading(false);
        }
      }
    }

    fetchSelectedRoute();

    return () => controller.abort();
  }, [
    userLocation,
    selectedBank?.id,
    selectedBank?.latitude,
    selectedBank?.longitude,
    token,
  ]);
  function requestUserLocation() {
    // 1. Check browser support
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Your browser does not support location.");
      return;
    }

    // 2. Show loading
    setLocationStatus("loading");
    setLocationError("");

    // 3. Request location
    navigator.geolocation.getCurrentPosition(
      // SUCCESS CALLBACK
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // 4. Store coordinates
        setUserLocation({
          latitude,
          longitude,
        });

        // 5. Update status
        setLocationStatus("success");

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
      },

      // ERROR CALLBACK
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationError("Please allow location access in browser settings.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus("error");
          setLocationError("Your current location is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus("error");
          setLocationError("Location request timed out. Please try again.");
        }
      },

      // OPTIONS
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }
  async function nearestBloodBank() {
    if (!userLocation) {
      setLocationError("Please allow access to your location first.");
      return;
    }

    setLoading(true);
    setLocationError("");

    try {
      const results = await getNearestBloodBanks(
        userLocation.latitude,
        userLocation.longitude,
      );

      setBloodBank(results);
      setSelectedId(results[0]?.id ?? null);
    } catch (error) {
      setLocationError(
        error instanceof Error ? error.message : "Blood-bank search failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p>Something want wrong</p>;
  }
  return (
    <div className="flex gap-4 mt-4 flex-col lg:flex-row ">
      <div className="relative h-48 md:h-[350px]  w-full lg:w-lg overflow-hidden rounded-xl border [&_.mapboxgl-ctrl-logo]:hidden!">
        <Map
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapboxAccessToken={token}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          attributionControl={false}
          style={{ position: "absolute", inset: 0 }}
        >
          {locationStatus === "loading" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <p className="text-sm font-medium text-gray-700">
                  Fetching your location...
                </p>
              </div>
            </div>
          )}
          {(locationStatus === "denied" || locationStatus === "error") && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 p-4">
              <div className="flex w-full max-w-sm flex-col items-center  rounded-xl bg-white p-6 text-center shadow-lg">
                <div className="rounded-full bg-red-50 p-3">
                  <LocateFixed className="h-7 w-7 text-red-500" />
                </div>

                <h3 className="font-semibold text-gray-900 text-base">
                  Unable to Get Your Location
                </h3>

                <p className="text-xs text-gray-500 font-medium">
                  {locationError}
                </p>

                <Button onClick={requestUserLocation} className="w-full mt-4">
                  <LocateFixed className="mr-2 h-4 w-4" />
                  Use My Location
                </Button>
              </div>
            </div>
          )}

          <NavigationControl
            position="bottom-right"
            showCompass={true}
            showZoom={true}
            style={{
              margin: "0 12px 12px 12px",
            }}
          />
          {userLocation && locationStatus == "success" && (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              anchor="bottom"
            >
              <MapPin size={30} color="white" fill="red" />
            </Marker>
          )}
          {selectedBank && (
            <Marker
              latitude={selectedBank.latitude}
              longitude={selectedBank.longitude}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <MapPin size={30} color="green" fill="white" />
                {/* <span className="rounded bg-white px-2 py-1 text-xs shadow">
                  {selectedBank.name}
                </span> */}
              </div>
            </Marker>
          )}
          {selectedId && routes[selectedId] && (
            <Source
              id="blood-bank-route"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: routes[selectedId],
              }}
            >
              <Layer
                id="blood-bank-route-line"
                type="line"
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
                paint={{
                  "line-color": "#2563eb",
                  "line-width": 5,
                  "line-opacity": 0.8,
                }}
              />
            </Source>
          )}
        </Map>
      </div>

      <div className="flex flex-col gap-4 flex-1 h-68 md:h-[350px]">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm md:text-base">
            Nearest Blood Banks
          </p>
          <Button
            onClick={nearestBloodBank}
            disabled={locationStatus !== "success" || bloodBank?.length != 0}
          >
            <Search />
            Find Blood Bank
          </Button>
        </div>
        <div className="flex flex-col gap-2 h-68 md:h-full  overflow-y-auto scrollbar-thin border border-gray-300 px-2 py-4 rounded-sm">
          {!loading && bloodBank?.length === 0 && (
            <div className="text-sm font-semibold flex flex-col gap-2 items-center justify-center h-full text-gray-500">
              <Landmark size={18} />
              <p> No banks found</p>
            </div>
          )}

          {loading ? (
            <div className="h-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            bloodBank?.map((item) => (
              <BloodBankCard
                key={item.id}
                blood_bank={item}
                checked={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
