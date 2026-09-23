import { useEffect, useState } from "react";
import { Glow } from "@/components/ui";

/**
 * A brief curtain: the wordmark surfaces through haze, a gold hairline draws,
 * then the veil lifts to reveal the room. Pure CSS timing, removed afterwards.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ready = window.setTimeout(onDone, reduce ? 0 : 1350);
    const remove = window.setTimeout(() => setGone(true), reduce ? 60 : 2700);
    return () => {
      window.clearTimeout(ready);
      window.clearTimeout(remove);
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div aria-hidden className="intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink">
      <Glow className="left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2" />
      <span className="intro-word relative font-serif text-6xl font-light italic text-gold-soft sm:text-7xl">Sira</span>
      <span className="intro-line relative mt-7 h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <span className="intro-caption relative mt-6 text-[10px] font-medium uppercase tracking-[0.55em] text-mist">
        Barcelona
      </span>
    </div>
  );
}
