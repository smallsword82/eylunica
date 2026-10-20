import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { onlineClient } from "./client";
import { onlineEnabled } from "./config";

export function useAccount() {
  const [session, setSession] = useState<Session | null>(null), [ready, setReady] = useState(false);
  useEffect(() => {
    if (!onlineEnabled) { setReady(true); return; }
    let mounted = true;
    onlineClient.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setReady(true); } })
      .catch(() => { if (mounted) setReady(true); });
    const { data } = onlineClient.auth.onAuthStateChange((_event, value) => {
      if (mounted) { setSession(value); setReady(true); }
    });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);
  const username = session?.user.email?.endsWith("@accounts.eylunica.netlify.app") ? session.user.email.split("@")[0] : "";
  return { session, ready, username };
}
