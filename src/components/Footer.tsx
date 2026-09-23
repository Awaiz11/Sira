import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { VENUE } from "@/data/content";
import { SCHEDULE, useBarStatus } from "@/lib/hours";
import { scrollToTarget } from "@/lib/smoothScroll";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ArrowIcon, CONTAINER, Glow, Magnetic, PillButton, SectionLabel, StatusDot, TextLink } from "@/components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PHRASES = ["Una copa, una nit", "Vermut a mitjanit", "El Born, Barcelona", "Poured slowly"];

function Heading({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.4em] text-gold">{children}</p>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <p role="status" className="animate-fade-up mt-8 font-serif text-[1.7rem] font-light italic leading-snug text-gold-soft">
        Thank you — the next letter will find you.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="relative flex items-center">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby="newsletter-hint"
          className="peer w-full bg-transparent py-4 pr-16 font-serif text-[1.35rem] font-light text-ivory placeholder:text-smoke focus:outline-none"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ivory/15" />
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-700 ease-out-expo peer-focus:scale-x-100",
            state === "error" ? "scale-x-100 bg-ember" : "scale-x-0 bg-gold"
          )}
        />
        <button
          type="submit"
          aria-label="Subscribe to the newsletter"
          className="group absolute right-0 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-ivory/[0.06] text-gold-soft transition-colors duration-500 hover:bg-gold hover:text-ink"
        >
          <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-[220%]" />
          <ArrowIcon className="absolute h-4 w-4 -translate-x-[220%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
        </button>
      </div>
      <p
        id="newsletter-hint"
        role={state === "error" ? "alert" : undefined}
        className={cn("mt-3 text-[11.5px] tracking-[0.04em]", state === "error" ? "text-ember" : "text-smoke")}
      >
        {state === "error" ? "Please enter a valid email address." : "Four letters a year. Unsubscribe anytime."}
      </p>
    </form>
  );
}

export function Footer({ onReserve }: { onReserve: () => void }) {
  const status = useBarStatus();
  const year = new Date().getFullYear();

  return (
    <footer id="visit" className="relative overflow-hidden bg-ink pt-10 lg:pt-14">
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

      <div className={cn(CONTAINER, "relative mt-20 lg:mt-28")}>
        {/* Closing invitation */}
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-12 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <SectionLabel index="04">Visit</SectionLabel>
            </Reveal>
            <RevealLines
              className="mt-10 font-serif text-[clamp(3.2rem,8vw,8rem)] font-light leading-[0.92] tracking-[-0.02em] text-ivory"
              lines={[
                "Your table",
                <>
                  is <em className="font-light italic text-gold-soft">waiting.</em>
                </>,
              ]}
            />
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-4 lg:pb-3">
            <Reveal delay={150}>
              <p className="text-[15.5px] leading-[1.9] text-ivory/60">
                Most of the room is kept for reservations, with a few stools at the bar for walk-ins. For seven guests or
                more, write to us and we'll set the evening.
              </p>
              <div className="mt-9">
                <Magnetic>
                  <PillButton onClick={onReserve} />
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Details */}
        <div className="mt-24 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:mt-36 xl:grid-cols-12">
          <Reveal className="xl:col-span-3">
            <Heading>Find us</Heading>
            <address className="font-serif text-[1.65rem] font-light not-italic leading-[1.3] text-ivory">
              {VENUE.street}
              <br />
              {VENUE.district}
            </address>
            <p className="mt-3 text-[13px] leading-relaxed text-ivory/45">Ring the brass bell beside the unmarked oak door.</p>
            <TextLink href={VENUE.maps} external className="mt-7">
              Open in Maps
            </TextLink>
          </Reveal>

          <Reveal delay={100} className="xl:col-span-3">
            <Heading>Hours</Heading>
            <ul className="space-y-3.5">
              {SCHEDULE.map((row) => (
                <li key={row.days} className="flex items-baseline justify-between gap-6 text-[14px]">
                  <span className="text-ivory/55">{row.days}</span>
                  <span className={cn("tabular-nums", row.hours === "Closed" ? "text-smoke" : "text-ivory/90")}>{row.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-soft">
              <StatusDot open={status.open} />
              {status.label}
            </p>
          </Reveal>

          <Reveal delay={200} className="xl:col-span-2">
            <Heading>Contact</Heading>
            <ul className="space-y-3.5 text-[14px]">
              <li>
                <a href={VENUE.phoneHref} className="link-line pb-0.5 text-ivory/80 transition-colors duration-500 hover:text-gold-soft">
                  {VENUE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${VENUE.email}`} className="link-line pb-0.5 text-ivory/80 transition-colors duration-500 hover:text-gold-soft">
                  {VENUE.email}
                </a>
              </li>
              <li>
                <a
                  href={VENUE.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="link-line pb-0.5 text-ivory/80 transition-colors duration-500 hover:text-gold-soft"
                >
                  {VENUE.instagram}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={300} className="xl:col-span-4">
            <Heading>Letters from Sira</Heading>
            <p className="text-[14px] leading-relaxed text-ivory/55">
              Seasonal menus, guest shifts and the occasional private evening — before anyone else hears of them.
            </p>
            <Newsletter />
          </Reveal>
        </div>
      </div>

      {/* Sign-off */}
      <div className="relative mt-28 lg:mt-40">
        <div
          className={cn(
            CONTAINER,
            "relative z-10 flex flex-col gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-smoke sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          <span>© {year} Sira Barcelona</span>
          <span className="hidden md:block">{VENUE.coords}</span>
          <span>Please enjoy responsibly</span>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex items-center gap-3 self-start transition-colors duration-500 hover:text-gold-soft sm:self-auto"
          >
            Back to top
            <ArrowIcon direction="up" className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
          </button>
        </div>
        <div aria-hidden className="pointer-events-none mt-6 select-none overflow-hidden">
          <p className="translate-y-[16%] bg-gradient-to-b from-ivory/[0.1] via-ivory/[0.04] to-transparent bg-clip-text text-center font-serif text-[clamp(9rem,40vw,42rem)] font-light leading-[0.78] tracking-[-0.04em] text-transparent">
            Sira
          </p>
        </div>
      </div>
    </footer>
  );
}
