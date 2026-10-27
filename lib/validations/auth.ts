import { z } from "zod";

/**
 * Helper to inspect and validate Indian mobile phone numbers.
 * Permitted input formats:
 *  - 10 digits starting with 6, 7, 8, 9 (e.g. "9876543210")
 *  - With country code +91 (e.g. "+919876543210" or "+91 98765 43210")
 *  - With country code 91 (e.g. "919876543210" or "91 9876543210")
 * Separators such as spaces and hyphens are supported, but arbitrary
 * invalid characters (letters, symbols) are rejected without silent stripping.
 */
export function validateIndianPhoneRaw(val: unknown): {
  success: boolean;
  normalized?: string;
  digits?: string;
  error?: string;
} {
  if (typeof val !== "string") {
    return { success: false, error: "Phone number is required" };
  }

  const trimmed = val.trim();
  if (!trimmed) {
    return { success: false, error: "Phone number is required" };
  }

  // Reject any character that is not a digit, space, hyphen, or leading '+'
  if (/[^0-9\s\-+]/.test(trimmed)) {
    return {
      success: false,
      error: "Phone number contains invalid characters",
    };
  }

  // '+' must only appear once and only at the very start
  if (trimmed.includes("+") && !trimmed.startsWith("+")) {
    return { success: false, error: "Invalid phone number format" };
  }
  if ((trimmed.match(/\+/g) || []).length > 1) {
    return { success: false, error: "Invalid phone number format" };
  }

  // Remove valid formatting separators (spaces and hyphens)
  const stripped = trimmed.replace(/[\s\-]/g, "");

  let tenDigits = "";

  if (stripped.startsWith("+91")) {
    const afterCode = stripped.slice(3);
    if (afterCode.length < 10) {
      return {
        success: false,
        error: "Phone number is too short (must be 10 digits)",
      };
    }
    if (afterCode.length > 10) {
      return {
        success: false,
        error: "Phone number is too long (must be 10 digits)",
      };
    }
    if (!/^[6-9]/.test(afterCode)) {
      return {
        success: false,
        error: "Indian mobile numbers must start with 6, 7, 8, or 9",
      };
    }
    tenDigits = afterCode;
  } else if (stripped.startsWith("+")) {
    return {
      success: false,
      error: "Only Indian mobile numbers (+91) are supported",
    };
  } else if (stripped.length === 12 && stripped.startsWith("91")) {
    const afterCode = stripped.slice(2);
    if (!/^[6-9]/.test(afterCode)) {
      return {
        success: false,
        error: "Indian mobile numbers must start with 6, 7, 8, or 9",
      };
    }
    tenDigits = afterCode;
  } else if (stripped.length === 10) {
    if (!/^[6-9]/.test(stripped)) {
      return {
        success: false,
        error: "Indian mobile numbers must start with 6, 7, 8, or 9",
      };
    }
    tenDigits = stripped;
  } else if (stripped.length < 10) {
    return {
      success: false,
      error: "Phone number is too short (must be 10 digits)",
    };
  } else {
    return {
      success: false,
      error: "Phone number is too long (must be 10 digits)",
    };
  }

  return {
    success: true,
    digits: tenDigits,
    normalized: `+91${tenDigits}`,
  };
}

/**
 * Reusable Zod schema for Email validation.
 * Trims leading/trailing whitespace, rejects empty emails, and ensures valid email format.
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" });

/**
 * Reusable Zod schema for Indian Mobile Phone Number validation.
 * Accepts 10-digit Indian numbers starting with 6, 7, 8, or 9,
 * supports +91/91 prefixes and space/hyphen formatting,
 * rejects letters and malformed entries, and normalizes output to E.164 (+91XXXXXXXXXX).
 */
export const indianPhoneSchema = z
  .string()
  .trim()
  .min(1, { message: "Phone number is required" })
  .superRefine((val, ctx) => {
    const res = validateIndianPhoneRaw(val);
    if (!res.success) {
      ctx.addIssue({
        code: "custom",
        message: res.error || "Please enter a valid Indian mobile number",
      });
    }
  })
  .transform((val) => {
    const res = validateIndianPhoneRaw(val);
    return res.normalized || val;
  });

/**
 * Schema for Sign In form (Email + Password)
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

/**
 * Schema for Sign Up form (Full Name + Email + Indian Phone + Password)
 */
export const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Full name is required" }),
  email: emailSchema,
  phone: indianPhoneSchema,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

/**
 * Schema for Email Magic Link requests
 */
export const magicLinkSchema = z.object({
  email: emailSchema,
});

/**
 * Inferred Types
 */
export type SignInInput = z.input<typeof signInSchema>;
export type SignInOutput = z.output<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpOutput = z.output<typeof signUpSchema>;
export type MagicLinkInput = z.input<typeof magicLinkSchema>;

/**
 * Convenience helper to validate email directly
 */
export function validateEmail(email: string) {
  return emailSchema.safeParse(email);
}

/**
 * Convenience helper to validate phone number directly
 */
export function validateIndianPhone(phone: string) {
  return indianPhoneSchema.safeParse(phone);
}

/**
 * Returns normalized E.164 phone number ("+919876543210") or throws on error.
 */
export function normalizeIndianPhone(phone: string): string {
  const res = indianPhoneSchema.safeParse(phone);
  if (!res.success) {
    throw new Error(res.error.issues[0]?.message || "Invalid Indian mobile number");
  }
  return res.data;
}
