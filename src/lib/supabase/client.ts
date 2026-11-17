import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  if (!isSupabaseConfigured()) {
    // Return a dummy client or fallback that reports meaningful configuration error
    return createBrowserClient<Database>(
      "https://placeholder.supabase.co",
      "placeholder-anon-key"
    );
  }

  clientInstance = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return clientInstance;
}
