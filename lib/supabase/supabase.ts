import { createBrowserClient } from "@supabase/ssr";
import { emailSchema } from "@/lib/validations/auth";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export async function sendEmailMagicLink(
  rawEmail: string,
  redirectTo?: string,
) {
  const email = emailSchema.parse(rawEmail);
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        redirectTo ??
        `${window.location.origin}/auth/callback`,
    },
  });
}
