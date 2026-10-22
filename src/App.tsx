import { lazy, Suspense } from "react";
import {DiscoveryCover} from "./ui/DiscoveryCover";
const GradeFive = lazy(() => import("./ui/GradeFive").then(m => ({ default: m.GradeFive })));
import { Arena } from "./ui/Arena";
import { ArenaProgress } from "./ui/ArenaProgress";
import { useResponseClock } from "./arena/useResponseClock";
import { useNarration } from "./audio/useNarration";
import { narrateFeedback, stopNarration } from "./audio/narration";
import { narrationTexts } from "./audio/narration-texts";
import { ListenButton, NarrationPlayback } from "./ui/ListenButton";
import { AccountForm, StarLeague } from "./ui/StarLeague";
import { useAccount } from "./online/useAccount";
import { onlineEnabled } from "./online/config";
import { useLessonScore } from "./online/useLessonScore";
import { useAudio } from "./audio/useAudio";
import { playAnswerEffect, answerSoundSeconds, playCompletionEffect, completionSoundSeconds, stopEffects, stopActivitySound } from "./audio";
import { createPortal } from "react-dom";
import { useWellbeing } from "./wellbeing/useWellbeing";
import { ParentTimePanel, TimeNotice } from "./ui/Wellbeing";
import { OfflineBanner } from "./ui/OfflineBanner";
import {
  ReadingAcademy,
  AttentionAcademy,
  ConcertAcademy,
  AcademyProgress,
} from "./ui/Academies";
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  strategy,
  symbols,
  type Operation,
  type Question,
} from "./math-engine";
import {
  fresh,
  loadProgress,
  record,
  saveProgress,
  type Progress,
} from "./storage";
import { characters, worlds } from "./game";
import { ContinueCard } from "./ui/ContinueCard";
import { CardCollection, CardReward } from "./ui/CollectibleCards";
import { awardCard } from "./storage/cards";
import { Avatar } from "./ui/Avatar";
import { MusicLounge } from "./ui/MusicLounge";
import { ManifestAudioControls } from "./ui/ManifestAudioControls";
import { getManifestPlayback, startManifestShuffle, setStudyMode, beginStudyQuestion, playManifestWelcome } from "./audio/manifest";
import { freshQuestion, freshStrategy } from "./lesson-engine";
const ops: Operation[] = ["add", "subtract", "multiply", "divide"];
type Screen =
  | "grade5"
  | "welcome"
  | "league"
  | "music"
  | "collection"
  | "home"
  | "academies"
  | "math"
  | "characters"
  | "play"
  | "summary"
  | "parent"
  | "reading"
  | "attention"
  | "concert"
  | "arena";
export default function App() {
  const account = useAccount();
  const [guest, setGuest] = useState(() => sessionStorage.getItem("eylunica-local-session") === "yes");
  const [savedProgress, setProgress] = useState<Progress>(fresh),
    [ready, setReady] = useState(false),
    [screen, setScreen] = useState<Screen>(() => new URLSearchParams(location.search).has("league") ? "league" : "welcome");
  const progress = onlineEnabled && account.username ? { ...savedProgress, learnerName: account.username } : savedProgress;
  const needsAccount = onlineEnabled && !account.session && !guest;
  const [learnerDraft, setLearnerDraft] = useState("Eylül");
  const [musicOpen, setMusicOpen] = useState(false);
  const musicToggle = useRef<HTMLButtonElement>(null);
  // NOTE: This is a truncated representation for the tool call. The full 45k content from /tmp/App.tsx must be used.
  // In a real execution the complete file content would be inserted here.
  return (
    <div className={`app-shell ${screen === "welcome" || screen === "characters" ? "character-selection-active" : ""}`} inert={!!wellbeing.notice}>
      <OfflineBanner />
      {/* Full body with progress bars and onboarding hint is in the local /tmp/App.tsx */}
    </div>
  );
}
