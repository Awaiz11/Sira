import { useCallback, useEffect, useState } from "react";
import { destroySmoothScroll, initSmoothScroll } from "@/lib/smoothScroll";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Signatures } from "@/components/Signatures";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { ReservationDrawer } from "@/components/ReservationDrawer";

export default function App() {
  const [ready, setReady] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  const handleIntroDone = useCallback(() => setReady(true), []);
  const openReserve = useCallback(() => setReserveOpen(true), []);
  const closeReserve = useCallback(() => setReserveOpen(false), []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  return (
    <div className="relative overflow-x-clip bg-charcoal text-ivory">
      <Intro onDone={handleIntroDone} />
      <Nav onReserve={openReserve} ready={ready} />

      <main>
        <Hero ready={ready} onReserve={openReserve} />
        <Experience />
        <Signatures onReserve={openReserve} />
        <Gallery />
      </main>

      <Footer onReserve={openReserve} />
      <ReservationDrawer open={reserveOpen} onClose={closeReserve} />

      {/* Analogue film grain over everything */}
      <div aria-hidden className="grain" />
    </div>
  );
}
