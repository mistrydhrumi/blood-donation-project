import { z } from "zod";

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
] as const;

export const GENDERS = [
  "male", "female", "other", "prefer_not_to_say",
] as const;

export const ROLES = ["donor", "requester", "both"] as const;

/* ── Step 1 ─────────────────────────────────────────────────────────── */

export const profileStepOneSchema = z.object({
  role: z.enum(ROLES, {
    error: "Please choose how you will use BloodBridge",
  }),
});

/* ── Step 2 — About You ─────────────────────────────────────────────── */

export const profileStepTwoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name is too long" }),
  city: z
    .string()
    .trim()
    .min(2, { message: "City is required" })
    .max(100, { message: "City name is too long" }),
  state: z
    .string()
    .trim()
    .min(2, { message: "State is required" })
    .max(100, { message: "State name is too long" }),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, {
      message: "Enter a valid 6-digit Indian PIN code",
    }),
});

/* ── Step 3 — Donor Availability ────────────────────────────────────── */

export const profileStepThreeSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, {
    error: "Please select your blood group",
  }),
  lastDonationDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const d = new Date(val);
        if (isNaN(d.getTime())) return false;
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        return d <= now;
      },
      { message: "Last donation date cannot be in the future" }
    ),
  weight: z
    .number({ error: "Weight is required" })
    .min(20, { message: "Weight must be at least 20 kg" })
    .max(300, { message: "Weight must be less than 300 kg" }),
  age: z
    .number({ error: "Age is required" })
    .int({ message: "Age must be a whole number" })
    .min(18, { message: "You must be at least 18 to donate blood" })
    .max(120, { message: "Please enter a valid age" }),
  gender: z.enum(GENDERS, {
    error: "Please select your gender",
  }),
  disease: z.string().trim().max(500, { message: "Too long" }).optional(),
  isAvailable: z.boolean().default(true),
});

/* ── Combined ────────────────────────────────────────────────────────── */

export const profileSetupSchema = profileStepOneSchema
  .merge(profileStepTwoSchema)
  .merge(profileStepThreeSchema);

export type ProfileStepOneData   = z.infer<typeof profileStepOneSchema>;
export type ProfileStepTwoData   = z.infer<typeof profileStepTwoSchema>;
export type ProfileStepThreeData = z.infer<typeof profileStepThreeSchema>;
export type ProfileSetupData     = z.infer<typeof profileSetupSchema>;

export function toProfilePayload(data: ProfileSetupData) {
  return {
    role:               data.role === "requester" ? "receiver" : data.role,
    full_name:          data.fullName.trim(),
    city:               data.city.trim() || null,
    state:              data.state.trim() || null,
    pincode:            data.pincode.trim() || null,
    blood_group:        data.bloodGroup,
    last_donation_date: data.lastDonationDate || null,
    weight_kg:          data.weight != null ? Number(data.weight) : null,
    age:                data.age != null ? Number(data.age) : null,
    gender:             data.gender || null,
    has_disease:        Boolean(data.disease && data.disease.trim().length > 0),
    is_available:       Boolean(data.isAvailable),
  };
}
