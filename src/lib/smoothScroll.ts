import Lenis from "lenis";

let lenis: Lenis | null = null;
let lockCount = 0;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Buttery, inertia-based page scrolling (disabled for reduced-motion users). */
export function initSmoothScroll() {
  if (lenis || typeof window === "undefined" || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2,
  });

  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

/** Scroll to a section id / element / pixel offset with a long, graceful ease. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.8,
      easing: (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }

  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Freeze the page behind overlays (menu, drawer, lightbox). Reference-counted. */
export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  lenis?.start();
  document.documentElement.style.overflow = "";
}
