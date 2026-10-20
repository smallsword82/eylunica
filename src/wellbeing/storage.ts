import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { decodeWellbeing, type WellbeingState } from "../time-engine";
export const WELLBEING_KEY = "ritma-wellbeing-v1";
export async function loadWellbeing(): Promise<WellbeingState> {
  return decodeWellbeing(
    Capacitor.isNativePlatform()
      ? (await Preferences.get({ key: WELLBEING_KEY })).value
      : localStorage.getItem(WELLBEING_KEY),
  );
}
export async function saveWellbeing(s: WellbeingState): Promise<void> {
  if (Capacitor.isNativePlatform())
    await Preferences.set({ key: WELLBEING_KEY, value: JSON.stringify(s) });
  else localStorage.setItem(WELLBEING_KEY, JSON.stringify(s));
}
