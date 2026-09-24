import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { VENUE } from "@/data/content";
import { SCHEDULE, useBarStatus } from "@/lib/hours";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ArrowIcon, CONTAINER, Glow, Magnetic, PillButton, SectionLabel, StatusDot, TextLink } from "@/components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
      <label htmlFor="contact-newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="relative flex items-center">
        <input
          id="contact-newsletter-email"
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
          aria-describedby="contact-newsletter-hint"
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
        id="contact-newsletter-hint"
        role={state === "error" ? "alert" : undefined}
        className={cn("mt-3 text-[11.5px] tracking-[0.04em]", state === "error" ? "text-ember" : "text-smoke")}
      >
        {state === "error" ? "Please enter a valid email address." : "Four letters a year. Unsubscribe anytime."}
      </p>
    </form>
  );
}

export function ContactPage({ onReserve }: { onReserve: () => void }) {
  const status = useBarStatus();

  return (
    <main>
      {/* Hero invitation */}
      <section className="relative overflow-x-clip bg-ink pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-52 lg:pb-40">
        <Glow className="left-1/2 top-[18%] h-[90vw] w-[90vw] -translate-x-1/2 lg:h-[60vw] lg:w-[60vw]" />

        <div className={cn(CONTAINER, "relative")}>
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
                  Most of the room is kept for reservations, with a few stools at the bar for walk-ins. For seven guests
                  or more, write to us and we'll set the evening.
                </p>
                <div className="mt-9">
                  <Magnetic>
                    <PillButton onClick={onReserve} />
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <section className="relative overflow-x-clip bg-ink pb-28 sm:pb-36 lg:pb-48">
        <div className={cn(CONTAINER, "relative")}>
          {/* Divider */}
          <div aria-hidden className="mb-16 h-px w-full bg-ivory/[0.06] lg:mb-24" />

          <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-12">
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

          {/* Map / directions callout */}
          <Reveal className="mt-20 lg:mt-28">
            <div className="relative overflow-hidden rounded-[4px] bg-soot p-8 sm:p-12 lg:p-16">
              <Glow className="-right-1/4 -top-1/4 h-[60%] w-[60%]" />
              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                  <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.42em] text-gold">Getting here</p>
                  <p className="font-serif text-[clamp(1.5rem,2.8vw,2.6rem)] font-light leading-[1.15] text-ivory">
                    We're tucked inside a medieval alley in El Born — look for the brass lantern.
                  </p>
                </div>
                <div className="flex flex-col gap-5 text-[13px] leading-relaxed text-ivory/60">
                  <p>
                    <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-soft">Metro</span>
                    <br />
                    L4 Barceloneta or L1 Arc de Triomf — 8 min walk
                  </p>
                  <p>
                    <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-soft">Coordinates</span>
                    <br />
                    {VENUE.coords}
                  </p>
                  <TextLink href={VENUE.maps} external>
                    Open in Google Maps
                  </TextLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
