import type { LineString } from "geojson";

interface FetchRouteParams {
  user: {
    latitude: number;
    longitude: number;
  };
  bank: {
    latitude: number;
    longitude: number;
  };
  token: string;
  signal?: AbortSignal;
}

interface MapboxDirectionsResponse {
  routes?: {
    geometry: LineString;
  }[];
}

export async function fetchRoute({
  user,
  bank,
  token,
  signal,
}: FetchRouteParams): Promise<LineString> {
  const url =
    `${process.env.NEXT_PUBLIC_MAPBOX_DIRECTION_API}mapbox/driving/` +
    `${user.longitude},${user.latitude};` +
    `${bank.longitude},${bank.latitude}` +
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
