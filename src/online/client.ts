import { createClient } from "@supabase/supabase-js";

export const onlineClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://shtryogkcorfhoeslnco.supabase.co",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_frHqwJ8wECaVvsJXNUwxMg_phY5K16k",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
export type LeaguePlayer = { nickname: string; stars: number; visible: boolean; dailyStars: number };
export type Leader = { rank: number; nickname: string; stars: number };
export type LeagueQuestion = { id: string; prompt: string };
export async function leagueCall<Result>(name: string, parameters?: Record<string, unknown>): Promise<Result> {
  const { data, error } = await onlineClient.rpc(name, parameters);
  if (error) throw new Error(error.message);
  return data as Result;
}
