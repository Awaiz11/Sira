import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export const CONTAINER = "mx-auto w-full max-w-[1560px] px-6 sm:px-10 lg:px-16";

/* ───────────── Icons ───────────── */

export function ArrowIcon({ className, direction = "right" }: { className?: string; direction?: "right" | "up" | "down" | "left" }) {
  const rotate = { right: "", down: "rotate-90", left: "rotate-180", up: "-rotate-90" }[direction];
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("shrink-0", rotate, className)}
    >
      <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("shrink-0", className)}>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

/* ───────────── Ambient light ───────────── */

export function Glow({ className, tone = "gold" }: { className?: string; tone?: "gold" | "ember" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full",
        tone === "gold"
          ? "bg-[radial-gradient(closest-side,rgba(200,162,107,0.15),rgba(200,162,107,0.05)_45%,transparent_75%)]"
          : "bg-[radial-gradient(closest-side,rgba(208,138,74,0.14),rgba(208,138,74,0.04)_45%,transparent_75%)]",
        className
      )}
    />
  );
}

/* ───────────── Typography helpers ───────────── */

export function SectionLabel({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.42em] text-mist", className)}>
      <span className="font-serif text-[15px] font-normal italic normal-case tracking-normal text-gold">({index})</span>
      <span aria-hidden className="h-px w-10 bg-gold/50" />
      <span>{children}</span>
    </div>
  );
}

export function StatusDot({ open, className }: { open: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-1.5 w-1.5 shrink-0 rounded-full", open ? "pulse-dot bg-gold" : "bg-smoke", className)}
    />
  );
}

type TextLinkProps = {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
  className?: string;
};

export function TextLink({ href, children, onClick, external, className }: TextLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory/75 transition-colors duration-500 hover:text-gold-soft",
        className
      )}
    >
      <span className="link-line pb-1">{children}</span>
      {external ? (
        <ArrowUpRight className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      ) : (
        <ArrowIcon className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
      )}
    </a>
  );
}

/* ───────────── Primary CTA ───────────── */

type PillButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  size?: "lg" | "sm";
  type?: "button" | "submit";
  full?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * Minimal pill: frosted outline at rest; on hover a liquid-gold fill blooms
 * out of the arrow while the arrow slips away and a new one glides in.
 */
export function PillButton({
  children = "Reserve a Table",
  onClick,
  size = "lg",
  type = "button",
  full = false,
  className,
  ariaLabel,
}: PillButtonProps) {
  const lg = size === "lg";

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ "--cx": lg ? "calc(100% - 1.75rem)" : "calc(100% - 1.375rem)" } as CSSProperties}
      className={cn(
        "group relative isolate inline-flex shrink-0 items-center rounded-full font-sans font-medium uppercase text-ivory",
        lg ? "h-14 gap-7 pl-8 pr-2 text-[11px] tracking-[0.3em]" : "h-11 gap-4 pl-5 pr-1.5 text-[10px] tracking-[0.28em]",
        full && "w-full justify-between",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-ivory/[0.045] ring-1 ring-inset ring-ivory/15 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-0"
      />
      <span aria-hidden className="btn-fill absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold" />
      <span className="relative whitespace-nowrap transition-colors duration-500 group-hover:text-ink">{children}</span>
      <span
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-gold text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-gold-soft",
          lg ? "h-10 w-10" : "h-8 w-8"
        )}
      >
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-[220%]" />
        <ArrowIcon className="absolute h-3.5 w-3.5 -translate-x-[220%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
      </span>
    </button>
  );
}

/* ───────────── Magnetic hover ───────────── */

export function Magnetic({ children, strength = 0.22, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-block transition-transform duration-700 ease-out-expo", className)}>
      {children}
    </div>
  );
}
