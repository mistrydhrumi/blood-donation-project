"use client";

import { useEffect, useState } from "react";
import type { LineString } from "geojson";
import { Spinner } from "@/components/ui/spinner";
import Map, {
  NavigationControl,
  Marker,
  useMap,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, LocateFixed, Search } from "lucide-react";
import BloodBankCard from "../ui/blood-bank-card";
import { Button } from "../ui/button";
interface BloodBank {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  distanceKm: number;
  mapsUrl: string;
}

const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function LocationMap() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routes, setRoutes] = useState<Record<string, GeoJSON.LineString>>({});
  const [isLocating, setIsLocating] = useState(false);
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
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      setIsLocating(false);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        setUserLocation({ latitude, longitude });

        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
          zoom: 15,
        }));

        setIsLocating(false);
      },
      () => {
        setLocationError("Unable to get your location.");

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);
  useEffect(() => {
    if (!userLocation || !selectedBank || !token) return;

    const controller = new AbortController();

    async function fetchRoute() {
      setRouteLoading(true);
      setRouteError("");

      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${userLocation?.longitude},${userLocation?.latitude};` +
          `${selectedBank?.longitude},${selectedBank?.latitude}` +
          `?geometries=geojson&overview=full&access_token=${token}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to fetch the route.");
        }

        const data = await response.json();
        const geometry = data.routes?.[0]?.geometry as LineString | undefined;

        if (!geometry || !selectedBank) {
          throw new Error("No driving route found.");
        }
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

    fetchRoute();

    return () => controller.abort();
  }, [
    userLocation,
    selectedBank?.id,
    selectedBank?.latitude,
    selectedBank?.longitude,
    token,
  ]);
  if (!token) {
    return <p>Something want wrong</p>;
  }

  async function nearestBloodBank() {
    setLoading(true);
    const response = await fetch("/api/blood-bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      }),
    });

    const data: { results?: BloodBank[]; error?: string } =
      await response.json();
    const results = data.results ?? [];

    setBloodBank(results);
    setSelectedId(results[0]?.id ?? null);

    if (!response.ok) {
      throw new Error(data.error ?? "Blood-bank search failed.");
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-4 mt-4 md:mt-8 flex-col md:flex-row">
      <div className="relative h-48 md:h-[350px] w-full md:w-lg overflow-hidden rounded-xl border [&_.mapboxgl-ctrl-logo]:hidden!">
        <Map
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapboxAccessToken={token}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          attributionControl={false}
          style={{ position: "absolute", inset: 0 }}
        >
          {isLocating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <p className="text-sm font-medium text-gray-700">
                  Fetching your location...
                </p>
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
          {userLocation && (
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

      <div className="flex flex-col gap-4 flex-1 ">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm md:text-base">
            Nearest Blood Banks
          </p>
          <Button
            onClick={nearestBloodBank}
            disabled={isLocating || bloodBank?.length != 0}
          >
            <Search />
            Find Blood Bank
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="min-h-80 flex justify-center items-center">
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
