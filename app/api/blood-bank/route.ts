import { NextRequest, NextResponse } from "next/server";
type Coordinates = {
  latitude: number;
  longitude: number;
};

function isCoordinates(value: unknown): value is Coordinates {
  if (typeof value !== "object" || value === null) return false;

  const body = value as Record<string, unknown>;

  return (
    typeof body.latitude === "number" &&
    Number.isFinite(body.latitude) &&
    body.latitude >= -90 &&
    body.latitude <= 90 &&
    typeof body.longitude === "number" &&
    Number.isFinite(body.longitude) &&
    body.longitude >= -180 &&
    body.longitude <= 180
  );
}

function distanceInKm(origin: Coordinates, destination: Coordinates): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(destination.latitude - origin.latitude);
  const dLon = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(origin.latitude)) *
      Math.cos(toRadians(destination.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isCoordinates(body)) {
      return NextResponse.json(
        { error: "Valid latitude and longitude are required." },
        { status: 400 },
      );
    }

    if (!MAPBOX_TOKEN) {
      return NextResponse.json(
        { error: "Mapbox access token is not configured." },
        { status: 500 },
      );
    }

    const origin: Coordinates = {
      latitude: body.latitude,
      longitude: body.longitude,
    };

    // Search Box forward search supports POI text queries.
    const search = async (query: string) => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_MAPBOX_SEARCH_API}forward`,
      );

      url.searchParams.set("q", query);
      url.searchParams.set(
        "proximity",
        `${origin.longitude},${origin.latitude}`,
      );
      url.searchParams.set("country", "IN");
      url.searchParams.set("language", "en");
      url.searchParams.set("types", "poi");
      url.searchParams.set("limit", "10");
      url.searchParams.set("access_token", MAPBOX_TOKEN);

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Mapbox search failed (${response.status}).`);
      }

      return response.json();
    };

    const [bloodBankData, hospitalData] = await Promise.all([
      search("blood bank"),
      search("hospital"),
    ]);

    const features = [
      ...(bloodBankData.features ?? []).map((feature: any) => ({
        feature,
        searchType: "blood_bank" as const,
      })),
      ...(hospitalData.features ?? []).map((feature: any) => ({
        feature,
        searchType: "hospital" as const,
      })),
    ];

    const seen = new Set<string>();

    const results = features
      .map(({ feature, searchType }) => {
        const properties = feature.properties ?? {};
        const [longitude, latitude] = feature.geometry?.coordinates ?? [];

        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return null;
        }

        const name = properties.name ?? "Unnamed place";
        const id = properties.mapbox_id ?? `${name}:${latitude}:${longitude}`;

        if (seen.has(id)) return null;
        seen.add(id);

        return {
          id,
          name,
          address: properties.full_address ?? properties.place_formatted ?? "",
          latitude,
          longitude,
          type: searchType,
          distanceKm: Number(
            distanceInKm(origin, { latitude, longitude }).toFixed(2),
          ),
          mapsUrl:
            `${process.env.NEXT_PUBLIC_MAP_SEARCH_API}?api=1&query=` +
            encodeURIComponent(`${latitude},${longitude}`),
        };
      })
      .filter((place): place is NonNullable<typeof place> => place !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Mapbox blood-bank search error:", error);

    return NextResponse.json(
      { error: "Unable to search nearby places. Please try again." },
      { status: 502 },
    );
  }
}

export async function GET() {
  try {
    if (!MAPBOX_TOKEN) {
      return NextResponse.json(
        { message: "Mapbox token is missing" },
        { status: 500 },
      );
    }

    const url = new URL(`${process.env.NEXT_PUBLIC_MAPBOX_SEARCH_API}forward`);

    url.searchParams.set("q", "blood bank in Ahmedabad");
    url.searchParams.set("access_token", MAPBOX_TOKEN);
    url.searchParams.set("country", "IN");
    url.searchParams.set("types", "poi");
    url.searchParams.set("limit", "10");
    url.searchParams.set("language", "en");
    url.searchParams.set("proximity", "72.5714,23.0225");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Mapbox search failed");
    }

    const data = await response.json();

    const results = (data.features ?? []).map((item: any) => ({
      id: item.properties.mapbox_id,
      name: item.properties.name,
      address: item.properties.full_address,
      longitude: item.geometry.coordinates[0],
      latitude: item.geometry.coordinates[1],
      type: "Blood Bank",
      mapsUrl: `${process.env.NEXT_PUBLIC_MAP_SEARCH_API}?api=1&query=${encodeURIComponent(
        item.properties.name,
      )}`,
    }));

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch blood banks" },
      { status: 500 },
    );
  }
}
