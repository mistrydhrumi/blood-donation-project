export interface BloodBank {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  distanceKm: number;
  mapsUrl: string;
}

interface BloodBankResponse {
  results?: BloodBank[];
  error?: string;
}

export async function getNearestBloodBanks(
  latitude: number,
  longitude: number,
): Promise<BloodBank[]> {
  const response = await fetch("/api/blood-bank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  const data: BloodBankResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Blood-bank search failed.");
  }

  return data.results ?? [];
}
