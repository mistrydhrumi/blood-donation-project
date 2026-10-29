
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Cookie updates may be unavailable in Server Components.
                        // The Next.js proxy will refresh sessions.
                    }
                },
            },
        },
    )
}
/*
cookies() reads cookies from the current Next.js request.
createServerClient() connects Supabase Auth to those cookies.
getAll() reads the existing session cookies.
setAll() writes updated cookies when the context permits it.
 */