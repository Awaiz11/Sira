import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { destroySmoothScroll, initSmoothScroll } from "@/lib/smoothScroll";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ReservationDrawer } from "@/components/ReservationDrawer";
import { HomePage } from "@/pages/HomePage";
import { MenuPage } from "@/pages/MenuPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { ContactPage } from "@/pages/ContactPage";

/* Scroll to top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AppShell() {
  const [ready, setReady] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const { pathname } = useLocation();

  const handleIntroDone = useCallback(() => setReady(true), []);
  const openReserve = useCallback(() => setReserveOpen(true), []);
  const closeReserve = useCallback(() => setReserveOpen(false), []);

  // Nav is always visible on sub-pages (skip the intro wait)
  const isHome = pathname === "/";
  const navReady = isHome ? ready : true;

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  return (
    <div className="relative overflow-x-clip bg-charcoal text-ivory">
      {/* Intro curtain only on home */}
      {isHome && <Intro onDone={handleIntroDone} />}

      <Nav onReserve={openReserve} ready={navReady} />

      <Routes>
        <Route path="/" element={<HomePage onReserve={openReserve} ready={ready} />} />
        <Route path="/menu" element={<MenuPage onReserve={openReserve} />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage onReserve={openReserve} />} />
      </Routes>

      <Footer onReserve={openReserve} />
      <ReservationDrawer open={reserveOpen} onClose={closeReserve} />

      {/* Analogue film grain over everything */}
      <div aria-hidden className="grain" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
}
