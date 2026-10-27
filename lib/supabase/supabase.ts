
import { createClient } from "@supabase/supabase-js";
import { emailSchema } from "@/lib/validations/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Validates email with Zod before requesting a Supabase magic link.
 */
export async function sendEmailMagicLink(rawEmail: string, redirectTo?: string) {
  const email = emailSchema.parse(rawEmail);
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        redirectTo ||
        (typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined),
    },
  });
}