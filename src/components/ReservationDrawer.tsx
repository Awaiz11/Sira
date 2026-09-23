import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { VENUE } from "@/data/content";
import { barcelonaNow, slotsFor, upcomingEvenings } from "@/lib/hours";
import { lockScroll, unlockScroll } from "@/lib/smoothScroll";
import { Glow, PillButton } from "@/components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const toMinutes = (slot: string) => {
  const [hh, mm] = slot.split(":").map(Number);
  return hh * 60 + mm;
};

function Field({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("mt-11", className)}>
      <legend className="mb-5 flex w-full items-center justify-between text-[10px] font-medium uppercase tracking-[0.36em] text-mist">
        <span>{label}</span>
        {error && <span className="normal-case tracking-[0.04em] text-ember">{error}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

type LineInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
};

function LineInput({ id, label, value, onChange, type = "text", autoComplete, error, className }: LineInputProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder=" "
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full bg-transparent pb-3 pt-7 font-serif text-[1.35rem] font-light text-ivory focus:outline-none"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80 transition-all duration-500 ease-out-expo peer-placeholder-shown:top-7 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-mist peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.3em] peer-focus:text-gold"
      >
        {label}
      </label>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ivory/15" />
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-700 ease-out-expo peer-focus:scale-x-100",
          error ? "scale-x-100 bg-ember" : "scale-x-0 bg-gold"
        )}
      />
      {error && <p className="absolute -bottom-6 left-0 text-[11px] text-ember">{error}</p>}
    </div>
  );
}

export function ReservationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const evenings = useMemo(() => upcomingEvenings(12), []);
  const nowMinutes = useMemo(() => barcelonaNow().minutes, [open]); // refresh whenever the drawer opens

  const slotsForEvening = (i: number) => {
    const ev = evenings[i];
    if (!ev || ev.closed) return [];
    const all = slotsFor(ev.open);
    return ev.offset === 0 ? all.filter((s) => toMinutes(s) > nowMinutes + 20) : all;
  };

  const firstAvailable = Math.max(
    0,
    evenings.findIndex((_, i) => slotsForEvening(i).length > 0)
  );

  const [dayIdx, setDayIdx] = useState(firstAvailable);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const slots = slotsForEvening(dayIdx);
  const evening = evenings[dayIdx];

  // Lock the page, focus management, Escape + focus trap
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const previous = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 450);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  // Reset the form a moment after closing a confirmed request
  useEffect(() => {
    if (open || !submitted) return;
    const t = window.setTimeout(() => {
      setSubmitted(false);
      setTime(null);
      setName("");
      setEmail("");
      setNote("");
      setGuests(2);
    }, 800);
    return () => window.clearTimeout(t);
  }, [open, submitted]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!time) next.time = "Please choose a time";
    if (!name.trim()) next.name = "Please tell us your name";
    if (!EMAIL_RE.test(email.trim())) next.email = "A valid email, please";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const firstName = name.trim().split(/\s+/)[0] ?? "";

  return (
    <div aria-hidden={!open} inert={!open} className={cn("fixed inset-0 z-[75]", !open && "pointer-events-none")}>
      {/* Veil */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-700 ease-out-expo",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-title"
        data-lenis-prevent
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto overscroll-contain bg-soot shadow-[-40px_0_120px_-30px_rgba(0,0,0,0.7)] transition-transform duration-[950ms] ease-out-expo sm:w-[520px] lg:w-[580px]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Glow className="-right-48 -top-48 h-[560px] w-[560px]" />

        <div className="relative flex items-center justify-between px-6 py-7 sm:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-mist">Reservations</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.34em] text-ivory/80 transition-colors duration-500 hover:text-gold-soft"
          >
            Close
            <span aria-hidden className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 h-px w-3 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-3 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        {submitted ? (
          <div className="animate-fade-up relative flex flex-1 flex-col px-6 pb-10 sm:px-12">
            <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-soft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="h-6 w-6" aria-hidden>
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="reserve-title" className="mt-10 font-serif text-[clamp(2.6rem,6vw,3.6rem)] font-light leading-[0.98]">
              Thank you, <em className="font-light italic text-gold-soft">{firstName}.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.85] text-ivory/60">
              We've received your request for{" "}
              <span className="text-ivory">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>{" "}
              on <span className="text-ivory">{evening?.longLabel}</span> at <span className="text-ivory">{time}</span>. A
              confirmation will arrive at <span className="text-ivory">{email.trim()}</span> within the hour.
            </p>
            <div className="mt-10 space-y-2 text-[13.5px] leading-relaxed text-ivory/50">
              <p className="text-ivory/80">
                {VENUE.street} · {VENUE.district}
              </p>
              <p>Ring the brass bell beside the unmarked oak door. We'll hold your table for fifteen minutes.</p>
            </div>
            <div className="mt-auto pt-14">
              <PillButton onClick={onClose} full>
                Back to Sira
              </PillButton>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative flex flex-1 flex-col px-6 pb-10 sm:px-12">
            <h2 id="reserve-title" className="mt-4 font-serif text-[clamp(2.8rem,6vw,3.9rem)] font-light leading-[0.95]">
              Reserve a <em className="font-light italic text-gold-soft">table</em>
            </h2>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ivory/55">
              Tables are held for fifteen minutes. For seven guests or more, write to{" "}
              <a href={`mailto:${VENUE.email}`} className="link-line text-ivory/80 hover:text-gold-soft">
                {VENUE.email}
              </a>
              .
            </p>

            <Field label="Evening">
              <div className="scrollbar-none -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:-mx-12 sm:px-12">
                {evenings.map((ev, i) => {
                  const available = slotsForEvening(i).length > 0;
                  const selected = i === dayIdx;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      disabled={!available}
                      aria-pressed={selected}
                      aria-label={`${ev.longLabel}${available ? "" : " — unavailable"}`}
                      onClick={() => {
                        setDayIdx(i);
                        setTime(null);
                      }}
                      className={cn(
                        "flex h-[82px] w-[70px] shrink-0 flex-col items-center justify-center rounded-[4px] transition-colors duration-300",
                        !available
                          ? "cursor-not-allowed bg-ivory/[0.02] text-smoke/70"
                          : selected
                            ? "bg-gold text-ink"
                            : "bg-ivory/[0.05] text-ivory hover:bg-ivory/10"
                      )}
                    >
                      <span className="text-[8.5px] font-medium uppercase tracking-[0.18em]">{ev.weekday}</span>
                      <span className="mt-1.5 font-serif text-[1.65rem] leading-none">{ev.dayNum}</span>
                      <span className="mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.18em] opacity-70">
                        {ev.closed ? "Closed" : available ? ev.month : "Full"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Time" error={errors.time}>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={time === slot}
                    onClick={() => {
                      setTime(slot);
                      setErrors((prev) => ({ ...prev, time: "" }));
                    }}
                    className={cn(
                      "h-11 rounded-full text-[13px] tabular-nums tracking-[0.04em] transition-colors duration-300",
                      time === slot ? "bg-gold text-ink" : "bg-ivory/[0.05] text-ivory/85 hover:bg-ivory/10"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Guests">
              <div className="flex items-center gap-5">
                {(
                  [
                    ["Fewer guests", -1, guests <= 1],
                    ["More guests", 1, guests >= 6],
                  ] as const
                ).map(([label, delta, disabled], k) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    disabled={disabled}
                    onClick={() => setGuests((g) => Math.min(6, Math.max(1, g + delta)))}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full bg-ivory/[0.05] text-ivory transition-colors duration-300 hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ivory/[0.05] disabled:hover:text-ivory",
                      k === 1 && "order-3"
                    )}
                  >
                    <span aria-hidden className="relative block h-3 w-3">
                      <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                      {delta > 0 && <span className="absolute left-0 top-1/2 h-px w-3 rotate-90 bg-current" />}
                    </span>
                  </button>
                ))}
                <span aria-live="polite" className="order-2 w-12 text-center font-serif text-[2.6rem] font-light leading-none">
                  {guests}
                </span>
                <span className="order-4 ml-2 text-[10px] font-medium uppercase tracking-[0.32em] text-mist">
                  {guests === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </Field>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8">
              <LineInput
                id="reserve-name"
                label="Name"
                value={name}
                autoComplete="name"
                error={errors.name || undefined}
                onChange={(v) => {
                  setName(v);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
              />
              <LineInput
                id="reserve-email"
                label="Email"
                type="email"
                value={email}
                autoComplete="email"
                error={errors.email || undefined}
                onChange={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
              />
            </div>
            <LineInput
              id="reserve-note"
              label="Occasion or requests (optional)"
              value={note}
              onChange={setNote}
              className="mt-10"
            />

            <div className="mt-auto pt-14">
              <PillButton type="submit" full>
                Request Table
              </PillButton>
              <p className="mt-5 text-center text-[11.5px] tracking-[0.03em] text-smoke">
                No deposit required · Confirmation within the hour
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
