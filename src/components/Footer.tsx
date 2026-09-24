import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { scrollToTarget } from "@/lib/smoothScroll";
import { ArrowIcon, CONTAINER, Glow } from "@/components/ui";

const PHRASES = ["Una copa, una nit", "Vermut a mitjanit", "El Born, Barcelona", "Poured slowly"];

export function Footer({ onReserve }: { onReserve: () => void }) {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden h-auto block bg-ink pt-12 pb-6">
      <Glow className="left-1/2 top-[18%] h-[90vw] w-[90vw] -translate-x-1/2 lg:h-[60vw] lg:w-[60vw]" />

      {/* Marquee */}
      <div aria-hidden className="relative flex select-none overflow-hidden whitespace-nowrap">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center">
              {PHRASES.map((p) => (
                <span
                  key={p}
                  className="flex items-center font-serif text-[clamp(3.5rem,9vw,9rem)] font-light italic leading-[1.1] text-ivory/[0.07]"
                >
                  <span className="px-[0.35em]">{p}</span>
                  <span className="text-[0.3em] not-italic text-gold/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sign-off */}
      <div className="relative mt-8">
        <div
          className={cn(
            CONTAINER,
            "relative z-10 flex flex-col items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-smoke lg:flex-row lg:justify-between"
          )}
        >
          {/* Left */}
          <div className="flex w-full flex-1 justify-center lg:w-auto lg:justify-start">
            <span>© {year} Sira Barcelona</span>
          </div>

          {/* Center */}
          <nav aria-label="Footer" className="flex flex-none justify-center gap-x-8">
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="transition-colors duration-500 hover:text-gold-soft"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={() => navigate("/gallery")}
              className="transition-colors duration-500 hover:text-gold-soft"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="transition-colors duration-500 hover:text-gold-soft"
            >
              Visit
            </button>
          </nav>

          {/* Right */}
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 lg:w-auto lg:flex-row lg:justify-end lg:gap-8">
            <span className="hidden sm:inline">Please enjoy responsibly</span>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group flex items-center gap-3 transition-colors duration-500 hover:text-gold-soft"
            >
              Back to top
              <ArrowIcon direction="up" className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
