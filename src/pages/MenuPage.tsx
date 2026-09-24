import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { COCKTAILS, type Cocktail } from "@/data/content";
import { Reveal, RevealLines } from "@/components/Reveal";
import { CONTAINER, Glow, SectionLabel, TextLink } from "@/components/ui";

function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("font-serif font-light text-gold-soft", className)}>
      <span className="mr-0.5 align-[0.35em] text-[0.55em]">€</span>
      {value}
    </span>
  );
}

/* ───────────── Desktop: showcase + list ───────────── */

function Showcase({ active }: { active: number }) {
  const current = COCKTAILS[active];

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-soot">
      {COCKTAILS.map((c, i) => (
        <img
          key={c.no}
          src={c.image}
          alt={i === active ? `${c.name} — ${c.notes.join(", ")}` : ""}
          aria-hidden={i !== active}
          draggable={false}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[1400ms] ease-out-expo",
            i === active ? "scale-100 opacity-100 blur-0" : "scale-[1.08] opacity-0 blur-[6px]"
          )}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/10" />

      <div className="absolute inset-x-0 top-[12%] flex justify-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.42em] text-ivory/55">Signature</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 xl:p-10">
        <div key={active} className="animate-fade-up">
          <p className="text-[10px] font-medium uppercase tracking-[0.36em] text-gold">N° {current.no}</p>
          <p className="mt-2 font-serif text-[2rem] font-light italic leading-none text-ivory">{current.translation}</p>
        </div>
        <p key={`g${active}`} className="animate-fade-up text-right text-[10px] font-medium uppercase tracking-[0.3em] text-ivory/55">
          {current.glass}
        </p>
      </div>
    </div>
  );
}

function MenuRow({
  cocktail,
  index,
  active,
  dimmed,
  onActivate,
}: {
  cocktail: Cocktail;
  index: number;
  active: boolean;
  dimmed: boolean;
  onActivate: (i: number) => void;
}) {
  return (
    <Reveal delay={index * 110}>
      <article
        tabIndex={0}
        onMouseEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        aria-label={`${cocktail.name}, ${cocktail.price} euros`}
        className={cn(
          "relative cursor-default py-9 outline-none transition-opacity duration-700 ease-out-expo xl:py-11",
          dimmed ? "opacity-30" : "opacity-100"
        )}
      >
        <div className="flex items-baseline gap-6">
          <span className="flex w-16 shrink-0 items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-gold">
            <span
              aria-hidden
              className={cn("h-px bg-gold transition-all duration-700 ease-out-expo", active ? "w-6 opacity-100" : "w-0 opacity-0")}
            />
            {cocktail.no}
          </span>
          <h3
            className={cn(
              "flex-1 font-serif text-[clamp(2.4rem,3.5vw,3.6rem)] font-light leading-none tracking-[-0.01em] transition-[translate,color] duration-700 ease-out-expo",
              active ? "translate-x-2 text-ivory" : "text-ivory/85"
            )}
          >
            {cocktail.name}
          </h3>
          <Price value={cocktail.price} className="text-[1.7rem]" />
        </div>
        <div className="mt-4 pl-[5.5rem]">
          <p className="text-[10.5px] font-medium uppercase leading-[1.9] tracking-[0.24em] text-mist">
            {cocktail.notes.join("  ·  ")}
          </p>
          <p
            className={cn(
              "mt-3 max-w-md text-[15px] leading-relaxed transition-colors duration-700",
              active ? "text-ivory/70" : "text-ivory/45"
            )}
          >
            {cocktail.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* ───────────── Mobile / tablet: snap carousel ───────────── */

function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const max = el.scrollWidth - el.clientWidth;
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const next = el.scrollLeft >= max - 4 ? COCKTAILS.length - 1 : Math.round(el.scrollLeft / step);
    setIndex(Math.max(0, Math.min(COCKTAILS.length - 1, next)));
  };

  return (
    <div className="mt-16 sm:mt-20 lg:hidden">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-none -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:scroll-px-10 sm:gap-6 sm:px-10"
      >
        {COCKTAILS.map((c, i) => (
          <article key={c.no} className="w-[80%] shrink-0 snap-start sm:w-[46%]">
            <Reveal delay={i * 100}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-soot">
                <img src={c.image} alt={`${c.name} cocktail`} draggable={false} className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 text-[10px] font-medium uppercase tracking-[0.34em] text-gold">
                  N° {c.no}
                </span>
                <span className="absolute bottom-5 right-5 text-[10px] font-medium uppercase tracking-[0.26em] text-ivory/60">
                  {c.glass}
                </span>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[2.1rem] font-light leading-none text-ivory">{c.name}</h3>
                <Price value={c.price} className="text-[1.5rem]" />
              </div>
              <p className="mt-2 font-serif text-lg italic text-ivory/50">{c.translation}</p>
              <p className="mt-4 text-[10px] font-medium uppercase leading-[1.9] tracking-[0.22em] text-mist">
                {c.notes.join(" · ")}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ivory/55">{c.description}</p>
            </Reveal>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-5" aria-hidden>
        <span className="font-serif text-[15px] italic text-gold">{String(index + 1).padStart(2, "0")}</span>
        <span className="relative h-px flex-1 bg-ivory/10">
          <span
            className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-700 ease-out-expo"
            style={{ width: `${((index + 1) / COCKTAILS.length) * 100}%` }}
          />
        </span>
        <span className="font-serif text-[15px] italic text-smoke">{String(COCKTAILS.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ───────────── Page ───────────── */

export function MenuPage({ onReserve }: { onReserve: () => void }) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  return (
    <main>
      <section className="relative overflow-x-clip bg-ink pt-36 pb-28 sm:pt-44 sm:pb-36 lg:pt-52 lg:pb-48">
        <Glow className="-left-[20vw] top-[22%] h-[80vw] w-[80vw] lg:h-[60vw] lg:w-[60vw]" />
        <Glow tone="ember" className="-right-[20vw] bottom-[15%] h-[60vw] w-[60vw] lg:h-[45vw] lg:w-[45vw]" />

        <div className={cn(CONTAINER, "relative")}>
          {/* Page header */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-10">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <SectionLabel index="02">Signatures</SectionLabel>
              </Reveal>
              <RevealLines
                className="mt-10 font-serif text-[clamp(2.6rem,5.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-ivory"
                lines={[
                  "Four drinks,",
                  <>
                    <em className="font-light italic text-gold-soft">composed</em> like a
                  </>,
                  "Mediterranean evening.",
                ]}
              />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end">
              <Reveal delay={150}>
                <p className="text-[15.5px] leading-[1.9] text-ivory/60">
                  A short list, rewritten with every season. Each drink is built around a single Catalan ingredient at its
                  peak — and every signature can be poured without alcohol.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="mt-24 hidden grid-cols-12 gap-x-10 lg:grid xl:mt-28">
            <div className="col-span-5">
              <div className="sticky top-28">
                <Reveal>
                  <Showcase active={active} />
                </Reveal>
              </div>
            </div>

            <div className="col-span-6 col-start-7 flex flex-col justify-center">
              <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                {COCKTAILS.map((c, i) => (
                  <MenuRow
                    key={c.no}
                    cocktail={c}
                    index={i}
                    active={active === i}
                    dimmed={hovering && active !== i}
                    onActivate={setActive}
                  />
                ))}
              </div>

              <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 pl-[5.5rem]">
                <TextLink
                  href="#reserve"
                  onClick={(e) => {
                    e.preventDefault();
                    onReserve();
                  }}
                >
                  Reserve to taste
                </TextLink>
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-smoke">
                  Full seasonal list served at the bar
                </span>
              </Reveal>
            </div>
          </div>

          {/* Mobile / tablet */}
          <Carousel />

          {/* Mobile reserve CTA */}
          <div className="mt-12 lg:hidden">
            <Reveal>
              <TextLink
                href="#reserve"
                onClick={(e) => {
                  e.preventDefault();
                  onReserve();
                }}
              >
                Reserve to taste
              </TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Seasonal note */}
      <section className="relative overflow-x-clip bg-charcoal py-20 sm:py-24 lg:py-32">
        <div className={cn(CONTAINER, "relative max-w-3xl")}>
          <Reveal>
            <span aria-hidden className="mb-8 block h-px w-10 bg-gold/60" />
            <blockquote className="font-serif text-[clamp(1.6rem,3vw,2.8rem)] font-light italic leading-[1.12] text-ivory/80">
              Our list changes with the seasons — ask your bartender what{" "}
              <em className="text-gold-soft not-italic">this week</em> tastes like.
            </blockquote>
            <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.38em] text-smoke">
              Núria Vidal — Founder &amp; Head of Bar
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
