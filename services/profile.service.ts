import { supabase } from "@/lib/supabase/supabase";
import {
  toProfilePayload,
  type ProfileSetupData,
  type ProfileStepOneData,
  type ProfileStepTwoData,
  type ProfileStepThreeData,
} from "@/lib/validations/profile";

export interface InitialProfileFormData {
  step1?: Partial<ProfileStepOneData>;
  step2?: Partial<ProfileStepTwoData>;
  step3?: Partial<ProfileStepThreeData>;
}


export async function getProfileFormData(): Promise<InitialProfileFormData | null> {
  try {
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !session?.user) return null;

    const user = session.user;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
    }

    if (profile) {
      return {
        step1: {
          role: profile.role === "receiver" ? "requester" : profile.role,
        },
        step2: {
          fullName: profile.full_name || user.user_metadata?.full_name || "",
          city: profile.city || "",
          state: profile.state || "",
          pincode: profile.pincode || "",
        },
        step3: {
          bloodGroup: profile.blood_group || "O+",
          lastDonationDate: profile.last_donation_date ? String(profile.last_donation_date).split("T")[0] : "",
          weight: profile.weight_kg != null ? Number(profile.weight_kg) : undefined,
          age: profile.age != null ? Number(profile.age) : undefined,
          gender: profile.gender || undefined,
          disease: profile.has_disease ? "Yes" : "",
          isAvailable: profile.is_available ?? true,
        },
      };
    }

    // If no existing profile row, pre-fill name from auth metadata
    if (user.user_metadata?.full_name) {
      return {
        step2: {
          fullName: user.user_metadata.full_name,
        },
      };
    }

    return null;
  } catch (err) {
    console.error("Failed to load profile form data:", err);
    return null;
  }
}

/**
 * Upserts user profile in the database.
 */
export async function upsertProfile(data: ProfileSetupData) {
  const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !session?.user) {
    return {
      data: null,
      error: { message: "Please sign in or create an account to save your profile.", code: "AUTH_REQUIRED" },
    };
  }

  const payload = {
    id: session.user.id,
    ...toProfilePayload(data),
    email: session.user.email ?? null,
    phone: session.user.user_metadata?.phone ?? session.user.phone ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  return { data: result, error };
}