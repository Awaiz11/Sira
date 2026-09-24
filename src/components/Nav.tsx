import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { NAV_LINKS, VENUE } from "@/data/content";
import { useScrollDirection } from "@/hooks/motion";
import { useBarStatus } from "@/lib/hours";
import { lockScroll, unlockScroll } from "@/lib/smoothScroll";
import { CONTAINER, Glow, PillButton, StatusDot } from "@/components/ui";

export function Nav({ onReserve, ready }: { onReserve: () => void; ready: boolean }) {
  const { scrolled, hidden } = useScrollDirection();
  const [open, setOpen] = useState(false);
  const status = useBarStatus();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Freeze the page while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open]);

  // Close the overlay if the viewport grows to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const reserve = () => {
    setOpen(false);
    onReserve();
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-700 ease-out-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          ready ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-ink/70 backdrop-blur-xl transition-opacity duration-700",
            scrolled && !open ? "opacity-100" : "opacity-0"
          )}
        />

        <div className={cn(CONTAINER, "relative flex h-20 items-center justify-between lg:h-24")}>
          {/* Left — desktop links / mobile menu toggle */}
          <div className="flex flex-1 items-center">
            <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "text-[10.5px] font-medium uppercase tracking-[0.32em] transition-colors duration-500",
                      isActive ? "text-ivory" : "text-ivory/65 hover:text-ivory"
                    )
                  }
                >
                  <span className="link-line pb-1">{link.label}</span>
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-ml-1 flex items-center gap-3 p-1 text-[10px] font-medium uppercase tracking-[0.32em] text-ivory/85 lg:hidden"
            >
              <span className="relative block h-3 w-7">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-7 bg-current transition-transform duration-500 ease-out-expo",
                    open && "translate-y-[5.5px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ease-out-expo",
                    open ? "w-7 -translate-y-[5.5px] -rotate-45" : "w-4"
                  )}
                />
              </span>
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
            </button>
          </div>

          {/* Centre — wordmark */}
          <Link
            to="/"
            aria-label="Sira — back to home"
            className="font-serif text-[1.95rem] font-light leading-none tracking-[0.01em] text-ivory lg:text-[2.25rem]"
          >
            Sira<span className="text-gold">.</span>
          </Link>

          {/* Right — live status + reserve */}
          <div className="flex flex-1 items-center justify-end gap-8">
            <p className="hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-mist xl:flex">
              <StatusDot open={status.open} />
              {status.label}
            </p>
            <PillButton size="sm" onClick={reserve} className="hidden sm:inline-flex">
              Reserve
            </PillButton>
            <button
              type="button"
              onClick={reserve}
              className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-soft sm:hidden"
            >
              Book
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — a curtain that drops from the top */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-40 bg-ink transition-[clip-path] duration-[900ms] ease-in-out-quart lg:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        )}
      >
        <Glow className="-right-1/3 top-1/4 h-[110vw] w-[110vw]" />
        <div className={cn(CONTAINER, "relative flex h-full flex-col justify-between pb-10 pt-32")}>
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.id}
                type="button"
                onClick={() => { setOpen(false); navigate(link.path); }}
                className="flex items-baseline gap-5 overflow-hidden py-1 text-left"
              >
                <span
                  className={cn(
                    "font-serif text-[15px] italic text-gold transition-opacity duration-700",
                    open ? "opacity-100" : "opacity-0"
                  )}
                  style={{ transitionDelay: open ? `${380 + i * 80}ms` : "0ms" }}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    "block font-serif text-[clamp(3rem,13vw,4.5rem)] font-light leading-[1.08] text-ivory transition-transform duration-[1000ms] ease-out-expo",
                    open ? "translate-y-0" : "translate-y-[110%]"
                  )}
                  style={{ transitionDelay: open ? `${300 + i * 80}ms` : "0ms" }}
                >
                  {link.label}
                </span>
              </button>
            ))}
          </nav>

          <div
            className={cn(
              "grid grid-cols-2 gap-6 text-[12px] leading-relaxed text-mist transition-opacity duration-700",
              open ? "opacity-100 delay-700" : "opacity-0"
            )}
          >
            <div>
              <p className="mb-2 text-[9.5px] font-medium uppercase tracking-[0.34em] text-ivory/45">Find us</p>
              <p>
                {VENUE.street}
                <br />
                {VENUE.district}
              </p>
            </div>
            <div>
              <p className="mb-2 text-[9.5px] font-medium uppercase tracking-[0.34em] text-ivory/45">Tonight</p>
              <p className="flex items-center gap-2">
                <StatusDot open={status.open} />
                {status.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
