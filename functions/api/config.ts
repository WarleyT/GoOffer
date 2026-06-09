import { json, type Env } from "./_shared";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return json(
    {
      supabase_url: env.SUPABASE_URL || env.VITE_SUPABASE_URL || "",
      supabase_anon_key: env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || ""
    },
    {
      headers: {
        "cache-control": "public, max-age=300, stale-while-revalidate=86400"
      }
    }
  );
};
