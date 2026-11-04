export async function getDefaultBloodBanks() {
  const response = await fetch("/api/blood-bank");

  if (!response.ok) {
    throw new Error("Failed to fetch blood banks");
  }

  const data = await response.json();

  return data.results;
}
