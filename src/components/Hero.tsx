import { useEffect, useRef, type CSSProperties } from "react";
import type { NavigateFunction } from "react-router-dom";
import { cn } from "@/utils/cn";
import { images, VENUE } from "@/data/content";
import { useParallax } from "@/hooks/motion";
import { useBarStatus } from "@/lib/hours";
import { scrollToTarget } from "@/lib/smoothScroll";
import { CONTAINER, Magnetic, PillButton, StatusDot, TextLink } from "@/components/ui";

const d = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero({ ready, onReserve, navigate }: { ready: boolean; onReserve: () => void; navigate?: NavigateFunction }) {
  const status = useBarStatus();
  const backdropRef = useParallax<HTMLDivElement>(0.32);
  const contentRef = useRef<HTMLDivElement>(null);

  // Content drifts and dissolves as the visitor steps inside
  useEffect(() => {
    const el = contentRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y > vh * 1.1) return;
      const p = Math.min(1, y / (vh * 0.8));
      el.style.opacity = String(1 - p * 0.95);
      el.style.transform = `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="top"
      aria-label="Sira cocktail bar"
      className={cn("relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink", ready && "is-ready")}
    >
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 will-change-transform">
        <img
          src={images.hero}
          alt="Candlelit stone vaults and a long walnut bar glowing amber inside Sira"
          fetchPriority="high"
          className={cn(
            "h-full w-full object-cover object-[38%_50%] transition-[transform,opacity,filter] duration-[3200ms] ease-out-expo",
            ready ? "scale-100 opacity-100 brightness-100" : "scale-[1.14] opacity-0 brightness-50"
          )}
        />
      </div>

      {/* Atmosphere */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/20 to-ink" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_35%,transparent_25%,rgba(11,10,9,0.78)_100%)]"
      />
      <div aria-hidden className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink/60 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[radial-gradient(38%_42%_at_82%_76%,rgba(11,10,9,0.72),transparent_100%)] lg:block"
      />
      <div
        aria-hidden
        className="flicker pointer-events-none absolute left-[68%] top-[40%] h-[75vmin] w-[75vmin] rounded-full bg-[radial-gradient(closest-side,rgba(214,164,98,0.2),rgba(214,164,98,0.06)_50%,transparent_76%)]"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(CONTAINER, "relative z-10 flex h-full flex-col justify-end pb-32 will-change-transform sm:pb-36 lg:pb-40")}
      >
        <div className="grid grid-cols-12 items-end gap-y-9 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-8">
            <p
              className="hero-fade mb-5 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.45em] text-ivory/70 sm:mb-7"
              style={d(150)}
            >
              <span aria-hidden className="h-px w-10 bg-gold/70" />
              <span>
                <span className="hidden sm:inline">Cocktail Bar · </span>El Born, Barcelona
              </span>
            </p>
            <h1
              aria-label="Sira"
              className="-ml-[0.05em] font-serif text-[clamp(8rem,46vw,30rem)] lg:text-[clamp(18rem,33vw,30rem)] font-light leading-[0.8] tracking-[-0.035em] text-ivory"
            >
              {"Sira".split("").map((char, i) => (
                <span key={i} aria-hidden className="hero-letter" style={d(120 + i * 120)}>
                  {char}
                </span>
              ))}
            </h1>
          </div>

          <div className="col-span-12 sm:col-span-9 md:col-span-7 lg:col-span-4 lg:pb-[2.4vw]">
            <p
              className="hero-fade text-balance font-serif text-[clamp(1.45rem,2.05vw,2rem)] font-light italic leading-[1.28] text-ivory/85"
              style={d(700)}
            >
              An intimate hour, poured slowly — behind an unmarked door in the old town.
            </p>
            <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-9 gap-y-6" style={d(900)}>
              <Magnetic>
                <PillButton onClick={onReserve} />
              </Magnetic>
              <TextLink
                href="/menu"
                onClick={(e) => {
                  e.preventDefault();
                  navigate ? navigate("/menu") : (window.location.href = "/menu");
                }}
              >
                The Menu
              </TextLink>
            </div>
          </div>
        </div>
      </div>

      {/* Meta rail */}
      <div
        className={cn(
          CONTAINER,
          "hero-fade absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 items-center pb-7 text-[10px] font-medium uppercase tracking-[0.32em] text-ivory/50 sm:grid-cols-3 sm:pb-8"
        )}
        style={d(1150)}
      >
        <span className="hidden sm:block">{VENUE.coords}</span>
        <button
          type="button"
          onClick={() => navigate ? navigate("/menu") : scrollToTarget("#experience")}
          className="group flex items-center gap-4 justify-self-start transition-colors duration-500 hover:text-gold-soft sm:justify-self-center"
        >
          <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-ivory/15">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/3 bg-gold" />
          </span>
          Scroll
        </button>
        <span className="flex items-center gap-3 justify-self-end text-right xl:hidden">
          <StatusDot open={status.open} />
          <span className="hidden min-[400px]:inline">{status.label}</span>
          <span className="min-[400px]:hidden">{status.short}</span>
        </span>
        <span className="hidden justify-self-end xl:block">{VENUE.street}</span>
      </div>
    </section>
  );
}
