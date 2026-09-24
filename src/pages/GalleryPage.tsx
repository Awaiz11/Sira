import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { GALLERY, VENUE } from "@/data/content";
import { lockScroll, unlockScroll } from "@/lib/smoothScroll";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ArrowIcon, ArrowUpRight, CONTAINER, Glow, SectionLabel } from "@/components/ui";
import type { MouseEvent } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/* ───────────── Lightbox ───────────── */

function Lightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (i: number) => void }) {
  const [shown, setShown] = useState(false);
  const item = GALLERY[index];
  const total = GALLERY.length;

  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(onClose, 450);
  }, [onClose]);

  const step = useCallback((dir: 1 | -1) => onChange((index + dir + total) % total), [index, onChange, total]);

  // Mount animation
  useEffect(() => {
    lockScroll();
    const id = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(id);
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  const stop = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={close}
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-md transition-opacity duration-500 ease-out-expo",
        shown ? "opacity-100" : "opacity-0"
      )}
    >
      <div className={cn(CONTAINER, "flex h-20 shrink-0 items-center justify-between text-[10px] font-medium uppercase tracking-[0.34em] text-mist")}>
        <span>
          <span className="font-serif text-[15px] font-normal italic normal-case tracking-normal text-gold">{pad(index + 1)}</span>
          <span className="mx-2">/</span>
          {pad(total)}
        </span>
        <button
          type="button"
          autoFocus
          onClick={stop(close)}
          className="flex items-center gap-3 text-ivory/80 transition-colors duration-500 hover:text-gold-soft"
        >
          Close
          <span aria-hidden className="relative block h-3 w-3">
            <span className="absolute left-0 top-1/2 h-px w-3 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-3 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24">
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          onClick={(e) => e.stopPropagation()}
          className="animate-fade-up max-h-full max-w-full rounded-[4px] object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        />
        {(
          [
            [-1, "left-2 sm:left-8", "Previous image", "left"],
            [1, "right-2 sm:right-8", "Next image", "right"],
          ] as const
        ).map(([dir, pos, label, arrow]) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={stop(() => step(dir))}
            className={cn(
              "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/[0.06] text-ivory backdrop-blur-md transition-colors duration-500 hover:bg-gold hover:text-ink",
              pos
            )}
          >
            <ArrowIcon direction={arrow} className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className={cn(CONTAINER, "flex h-24 shrink-0 items-center justify-between gap-6")}>
        <p key={item.title} className="animate-fade-up font-serif text-2xl font-light italic text-ivory sm:text-3xl">
          {item.title}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-mist">{item.time}</p>
      </div>
    </div>
  );
}

/* ───────────── Page ───────────── */

export function GalleryPage() {
  const [open, setOpen] = useState<number | null>(null);
  const handleClose = useCallback(() => setOpen(null), []);

  const tiles = GALLERY.map((item, i) => (
    <Reveal key={item.src} delay={(i % 3) * 110} className={cn("relative", item.className)}>
      <button
        type="button"
        onClick={() => setOpen(i)}
        aria-label={`Open image: ${item.title}`}
        className="group relative block h-full w-full overflow-hidden rounded-[4px] bg-soot text-left"
      >
        <img
          src={item.src}
          alt={item.alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.86] transition-[scale,filter] duration-[1800ms] ease-out-expo group-hover:scale-[1.06] group-hover:brightness-100"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-80 transition-opacity duration-700 lg:opacity-40 lg:group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
          <span className="font-serif text-[1.15rem] font-light italic leading-tight text-ivory transition-[opacity,translate] duration-700 ease-out-expo sm:text-2xl lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {item.title}
          </span>
          <span className="hidden text-[10px] font-medium tracking-[0.3em] text-ivory/60 transition-opacity delay-100 duration-700 sm:block lg:opacity-0 lg:group-hover:opacity-100">
            {item.time}
          </span>
        </div>
        <span
          aria-hidden
          className="absolute right-4 top-4 hidden h-10 w-10 scale-75 items-center justify-center rounded-full bg-ink/40 text-ivory opacity-0 backdrop-blur-md transition-[opacity,scale] duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 lg:flex"
        >
          <span className="relative block h-3 w-3">
            <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-3 rotate-90 bg-current" />
          </span>
        </span>
      </button>
    </Reveal>
  ));

  const followTile = (
    <Reveal key="follow" delay={220} className="col-span-1 row-span-1">
      <a
        href={VENUE.instagramHref}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[4px] bg-soot p-4 sm:p-6"
      >
        <Glow className="-bottom-1/2 -right-1/2 h-[170%] w-[170%] transition-transform duration-[1400ms] ease-out-expo group-hover:scale-125" />
        <span className="relative text-[9.5px] font-medium uppercase tracking-[0.34em] text-mist">Follow the glow</span>
        <span className="relative">
          <span className="block font-serif text-[clamp(1.35rem,2.3vw,2.3rem)] font-light italic leading-none text-gold-soft">
            {VENUE.instagram}
          </span>
          <span className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-ivory/60 transition-colors duration-500 group-hover:text-ivory">
            Instagram
            <ArrowUpRight className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
      </a>
    </Reveal>
  );

  // Place the Instagram tile in the fourth slot of the bento
  const cells = [...tiles.slice(0, 3), followTile, ...tiles.slice(3)];

  return (
    <main>
      {/* Header */}
      <section className="relative overflow-x-clip bg-charcoal pt-36 pb-0 sm:pt-44 lg:pt-52">
        <Glow tone="ember" className="-right-[25vw] top-[35%] h-[70vw] w-[70vw]" />

        <div className={cn(CONTAINER, "relative")}>
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10 lg:gap-x-10">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <SectionLabel index="03">Gallery</SectionLabel>
              </Reveal>
              <RevealLines
                className="mt-10 font-serif text-[clamp(2.6rem,5.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-ivory"
                lines={[
                  "Evenings,",
                  <>
                    kept in <em className="font-light italic text-gold-soft">amber.</em>
                  </>,
                ]}
              />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-9">
              <Reveal delay={150}>
                <p className="text-[15.5px] leading-[1.9] text-ivory/60">
                  Candlelight on old stone, the crackle of a record, a room full of low voices. A few frames from our
                  nights — the rest is best seen in person.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed grid */}
      <section className="relative overflow-x-clip bg-charcoal py-16 sm:py-20 lg:py-24">
        <div className={cn(CONTAINER, "relative")}>
          <div className="grid grid-flow-row-dense auto-rows-[44vw] grid-cols-2 gap-2.5 sm:auto-rows-[33vw] sm:gap-3 lg:auto-rows-[clamp(210px,19vw,300px)] lg:grid-cols-4 lg:gap-4">
            {cells}
          </div>
        </div>

        {open !== null && <Lightbox index={open} onClose={handleClose} onChange={setOpen} />}
      </section>

      {/* Film quote */}
      <section className="relative overflow-x-clip bg-ink py-20 sm:py-24 lg:py-32">
        <div className={cn(CONTAINER, "relative grid grid-cols-12 items-center gap-x-6 lg:gap-x-10")}>
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Reveal blur>
              <span aria-hidden className="mb-8 block h-px w-10 bg-gold/60" />
              <blockquote className="font-serif text-[clamp(1.8rem,3.4vw,3.2rem)] font-light italic leading-[1.1] text-ivory/80">
                A photograph is a secret about a secret. The more it tells you,{" "}
                <em className="text-gold-soft not-italic">the less you know.</em>
              </blockquote>
              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.38em] text-smoke">
                Diane Arbus — on evenings like ours
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
