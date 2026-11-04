export interface GeocodeCoordinates {
  latitude: number;
  longitude: number;
}

// In-memory cache for the current session
const memoryCache = new Map<string, GeocodeCoordinates | null>();

/**
 * Normalizes query string for caching and API request.
 * Format: "pincode, city, state, India"
 */
export function buildGeocodeQuery(
  pincode?: string | null,
  city?: string | null,
  state?: string | null
): string {
  const parts: string[] = [];

  const cleanPin = pincode ? pincode.trim() : "";
  const cleanCity = city ? city.trim() : "";
  const cleanState = state ? state.trim() : "";

  if (cleanPin) parts.push(cleanPin);
  if (cleanCity) parts.push(cleanCity);
  if (cleanState) parts.push(cleanState);
  parts.push("India");

  return parts.join(", ");
}

/**
 * Derives a clean cache key for a postal/city area.
 * Prefers 6-digit Indian pincode if available, otherwise "city, state".
 */
export function getGeocodeCacheKey(
  pincode?: string | null,
  city?: string | null,
  state?: string | null
): string {
  const cleanPin = pincode ? pincode.trim() : "";
  if (/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return `pin_${cleanPin}`;
  }

  const cleanCity = (city || "").trim().toLowerCase();
  const cleanState = (state || "").trim().toLowerCase();
  return `area_${cleanCity}_${cleanState}`;
}

/**
 * Geocodes a location query into approximate { latitude, longitude } using Mapbox.
 * Results are cached in memory and sessionStorage to minimize API usage.
 */
export async function geocodeLocation(
  pincode?: string | null,
  city?: string | null,
  state?: string | null
): Promise<GeocodeCoordinates | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    console.warn("Mapbox access token is missing.");
    return null;
  }

  const query = buildGeocodeQuery(pincode, city, state);
  const cacheKey = getGeocodeCacheKey(pincode, city, state);

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey) ?? null;
  }

  // 2. Check browser sessionStorage if available
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(`mb_geo_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored) as GeocodeCoordinates | null;
        memoryCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // sessionStorage unavailable or quota exceeded; continue to network request
    }
  }

  try {
    const encoded = encodeURIComponent(query);
    // Use Mapbox Search Box forward search API with fallback to geocoding v5
    const searchBase =
      process.env.NEXT_PUBLIC_MAPBOX_SEARCH_API?.replace(/\/+$/, "") ||
      "https://api.mapbox.com/search/searchbox/v1";

    const url = `${searchBase}/forward?q=${encoded}&country=IN&limit=1&access_token=${token}`;

    const response = await fetch(url);
    if (!response.ok) {
      // Fallback to Geocoding v5 places API
      const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?country=IN&limit=1&access_token=${token}`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) {
        memoryCache.set(cacheKey, null);
        return null;
      }
      const fallbackData = await fallbackRes.json();
      const center = fallbackData.features?.[0]?.center;
      if (Array.isArray(center) && center.length >= 2) {
        const coords: GeocodeCoordinates = {
          longitude: Number(center[0]),
          latitude: Number(center[1]),
        };
        saveToCache(cacheKey, coords);
        return coords;
      }
      memoryCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    const coordinates = data.features?.[0]?.geometry?.coordinates;
    if (Array.isArray(coordinates) && coordinates.length >= 2) {
      const coords: GeocodeCoordinates = {
        longitude: Number(coordinates[0]),
        latitude: Number(coordinates[1]),
      };
      saveToCache(cacheKey, coords);
      return coords;
    }

    memoryCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.error("Mapbox geocoding error for query:", query, error);
    memoryCache.set(cacheKey, null);
    return null;
  }
}

function saveToCache(key: string, coords: GeocodeCoordinates) {
  memoryCache.set(key, coords);
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(`mb_geo_${key}`, JSON.stringify(coords));
    } catch {
      // Ignore sessionStorage quota error
    }
  }
}

