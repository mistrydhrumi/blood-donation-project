import type { LineString } from "geojson";

interface FetchRouteParams {
  userLatitude: number;
  userLongitude: number;
  bankLatitude: number;
  bankLongitude: number;
  token: string;
  signal?: AbortSignal;
}

interface MapboxDirectionsResponse {
  routes?: {
    geometry: LineString;
  }[];
}

export async function fetchRoute({
  userLatitude,
  userLongitude,
  bankLatitude,
  bankLongitude,
  token,
  signal,
}: FetchRouteParams): Promise<LineString> {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${userLongitude},${userLatitude};` +
    `${bankLongitude},${bankLatitude}` +
    `?geometries=geojson&overview=full&access_token=${token}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Unable to fetch the route.");
  }

  const data: MapboxDirectionsResponse = await response.json();

  const geometry = data.routes?.[0]?.geometry;

  if (!geometry) {
    throw new Error("No driving route found.");
  }

  return geometry;
}
