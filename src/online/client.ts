import { createClient } from "@supabase/supabase-js";
import { onlineEnabled } from "./config";

export const onlineClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://shtryogkcorfhoeslnco.supabase.co",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_frHqwJ8wECaVvsJXNUwxMg_phY5K16k",
  { auth: { persistSession: onlineEnabled, autoRefreshToken: onlineEnabled, detectSessionInUrl: onlineEnabled } },
);
export type LeaguePlayer = { nickname: string; stars: number; visible: boolean; dailyStars: number };
export type Leader = { rank: number; nickname: string; stars: number };
export type LeagueQuestion = { id: string; prompt: string };
export async function leagueCall<Result>(name: string, parameters?: Record<string, unknown>): Promise<Result> {
  if (!onlineEnabled) throw new Error("Çevrimiçi hesaplar şimdilik kapalı.");
  const { data, error } = await onlineClient.rpc(name, parameters);
  if (error) throw new Error(error.message);
  return data as Result;
}
