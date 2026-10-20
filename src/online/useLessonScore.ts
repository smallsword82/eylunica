import { useEffect, useRef } from "react";
import type { Activity } from "../learning-engine";
import type { Question } from "../math-engine";
import { leagueCall, onlineClient } from "./client";
import { useAccount } from "./useAccount";

type Ticket = { id: string; owner: string };
export function useLessonScore(task: Activity | Question | null) {
  const account = useAccount();
  const current = useRef<{ ticket: Promise<Ticket | null>; sent: boolean }>({ ticket: Promise.resolve(null), sent: false });
  useEffect(() => {
    const owner = account.session?.user.id;
    const ticket = task && owner ? leagueCall<{ id: string } | null>("lesson_start", {
      p_key: "operation" in task ? "math" : task.id,
      p_math: "operation" in task ? { operation: task.operation, a: task.a, b: task.b } : null,
    }).then(value => value ? { id: value.id, owner } : null).catch(() => {
      window.dispatchEvent(new CustomEvent("eylunica-score", { detail: "Çevrimiçi yıldız bağlantısı kurulamadı. Cihazdaki öğrenmen kaydedilmeye devam ediyor." }));
      return null;
    }) : Promise.resolve(null);
    current.current = { ticket, sent: false };
  }, [task, account.session?.user.id]);
  return (answer: { answer?: number | null; evidence?: number | null; sequence?: number[] }) => {
    const attempt = current.current;
    if (attempt.sent) return;
    attempt.sent = true;
    void attempt.ticket.then(async ticket => {
      if (!ticket) return;
      const { data } = await onlineClient.auth.getSession();
      if (data.session?.user.id !== ticket.owner) return;
      await leagueCall("lesson_answer", { p_id: ticket.id, p_answer: answer });
    }).catch(() => window.dispatchEvent(new CustomEvent("eylunica-score", { detail: "Bu yanıtın çevrimiçi yıldızı kaydedilemedi. Cihazdaki ilerlemen korundu." })));
  };
}
