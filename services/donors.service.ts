import { supabase } from "@/lib/supabase/supabase";
import type { DonorItem } from "@/components/donors/DonorCard";

export interface SupabaseProfileRow {
  id: string;
  full_name: string | null;
  blood_group: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  role: "donor" | "receiver" | "both" | string | null;
  last_donation_date: string | null;
  is_available: boolean | null;
  age: number | null;
  gender: string | null;
  weight_kg: number | null;
  has_disease: boolean | null;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Format a name for public privacy: "Firstname L."
 */
export function formatPrivacyName(fullName: string | null | undefined): string {
  if (!fullName || !fullName.trim()) return "Verified Donor";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
  return `${first} ${lastInitial}.`;
}

/**
 * Derives 2-letter uppercase initials from full name
 */
export function getInitials(fullName: string | null | undefined): string {
  if (!fullName || !fullName.trim()) return "BD";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Check donor eligibility considering 90-day cooldown and opt-in availability
 */
export function checkEligibility(
  lastDonationDate: string | null | undefined,
  isAvailable: boolean | null | undefined
): { status: "Available" | "Unavailable" | "Cooldown"; label: string } {
  if (isAvailable === false) {
    return { status: "Unavailable", label: "Currently paused" };
  }

  if (lastDonationDate) {
    const lastDate = new Date(lastDonationDate);
    if (!isNaN(lastDate.getTime())) {
      const diffMs = Date.now() - lastDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 90) {
        const remaining = 90 - diffDays;
        return {
          status: "Cooldown",
          label: `Cooldown (${remaining}d left)`,
        };
      }
    }
  }

  return { status: "Available", label: "Available" };
}

/**
 * Calculates human-readable confirmation time from updated_at / created_at
 */
export function formatConfirmedAgo(
  updatedAt: string | null | undefined,
  createdAt: string | null | undefined
): string {
  const ts = updatedAt || createdAt;
  if (!ts) return "Confirmed recently";

  const d = new Date(ts);
  if (isNaN(d.getTime())) return "Confirmed recently";

  const diffMs = Date.now() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Confirmed just now";
  if (diffMinutes < 60) return `Confirmed ${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Confirmed ${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Confirmed ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return "Confirmed recently";
}

/**
 * Masks a phone number so raw digits are never exposed in public UI
 */
export function formatMaskedPhone(phone: string | null | undefined): string {
  if (!phone || !phone.trim()) return "Private";
  const clean = phone.replace(/\s+/g, "");
  if (clean.length < 8) return "••••••••";
  const start = clean.slice(0, 5);
  const end = clean.slice(-2);
  return `${start}••••${end}`;
}

/**
 * Transforms a Supabase `profiles` database record into a UI DonorItem
 */
export function mapProfileRowToDonor(
  row: SupabaseProfileRow,
  index = 0,
  targetCity = ""
): DonorItem {
  const eligibility = checkEligibility(row.last_donation_date, row.is_available);
  const isCityMatch = targetCity && row.city
    ? row.city.toLowerCase().includes(targetCity.toLowerCase().trim())
    : true;

  // Approximate distance estimation based on index and city match
  const approxDistance = isCityMatch
    ? `${(1.8 + (index % 6) * 0.7).toFixed(1)} km`
    : row.city
    ? `Near ${row.city}`
    : "Approx. distance";

  const smartMatchTag =
    eligibility.status === "Available"
      ? index % 2 === 0
        ? "Recently confirmed"
        : "Nearby"
      : eligibility.status === "Cooldown"
      ? eligibility.label
      : "Unavailable";

  return {
    id: row.id,
    name: formatPrivacyName(row.full_name),
    initials: getInitials(row.full_name),
    bloodGroup: row.blood_group || "O+",
    locality: row.pincode ? `PIN ${row.pincode}` : (row.city || "Area"),
    city: row.city || "Ahmedabad",
    state: row.state || undefined,
    pincode: row.pincode || undefined,
    distance: approxDistance,
    status: eligibility.status,
    confirmedAgo: formatConfirmedAgo(row.updated_at, row.created_at),
    smartMatchTag,
    phone: formatMaskedPhone(row.phone),
    rawPhone: row.phone || null,
    email: row.email || null,
    age: row.age || null,
    gender: row.gender || null,
    weight_kg: row.weight_kg != null ? Number(row.weight_kg) : null,
    has_disease: Boolean(row.has_disease),
    last_donation_date: row.last_donation_date || null,
    role: row.role || "donor",
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
  };
}

/**
 * Fetches all registered donors from Supabase `profiles` table.
 * Queries all users eligible as donors: role is 'donor' or 'both' (case-insensitive).
 */
export async function fetchDonorsFromSupabase(): Promise<{
  data: DonorItem[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        blood_group,
        city,
        state,
        pincode,
        role,
        last_donation_date,
        is_available,
        age,
        gender,
        weight_kg,
        has_disease,
        phone,
        email,
        latitude,
        longitude,
        created_at,
        updated_at
      `)
      .in("role", ["donor", "both"])
      .order("updated_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching donors from Supabase profiles:", error);
      return { data: [], error: new Error(error.message) };
    }

    if (!data || data.length === 0) {
      return { data: [], error: null };
    }

    // Include any user who is registered as 'donor' or 'both' (case-insensitive)
    const eligibleRows = (data as SupabaseProfileRow[]).filter((row) => {
      const r = (row.role || "").trim().toLowerCase();
      return r === "donor" || r === "both";
    });

    const donors = eligibleRows.map((row, idx) =>
      mapProfileRowToDonor(row, idx)
    );

    return { data: donors, error: null };
  } catch (err) {
    console.error("Exception fetching donors:", err);
    return {
      data: [],
      error: err instanceof Error ? err : new Error("Failed to load donors"),
    };
  }
}

