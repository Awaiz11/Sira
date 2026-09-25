import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { COCKTAILS } from "@/data/content";
import { Reveal, RevealImage, RevealLines } from "@/components/Reveal";
import { ArrowIcon, CONTAINER, Glow, SectionLabel } from "@/components/ui";

// Use the first two signature cocktails
const [FIRST, SECOND] = COCKTAILS;

export function SignatureDrinks() {
  return (
    <section
      id="signature-drinks"
      className="relative overflow-x-clip bg-ink pt-28 pb-28 sm:pt-36 sm:pb-36 lg:pt-48 lg:pb-48"
    >
      <Glow className="-left-[20vw] top-[10%] h-[65vw] w-[65vw] lg:h-[45vw] lg:w-[45vw]" />
      <Glow tone="ember" className="-right-[25vw] bottom-[15%] h-[60vw] w-[60vw] lg:h-[40vw] lg:w-[40vw]" />

      <div className={cn(CONTAINER, "relative")}>
        {/* Section header */}
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <SectionLabel index="02">Signature Drinks</SectionLabel>
          </Reveal>
          <Reveal delay={120} className="hidden text-[10px] font-medium uppercase tracking-[0.42em] text-smoke md:block">
            Curated — Seasonal
          </Reveal>
        </div>

        {/* Headline */}
        <div className="mt-14 sm:mt-18 lg:mt-20">
          <RevealLines
            as="h2"
            className="font-serif text-[clamp(2.4rem,4.8vw,5rem)] font-light leading-[0.98] tracking-[-0.015em] text-ivory"
            lines={[
              "Composed for the",
              <>
                season, poured{" "}
                <em className="font-light italic text-gold-soft">with care.</em>
              </>,
            ]}
          />
        </div>

        {/* Asymmetric two-cocktail grid */}
        <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-20 sm:mt-28 lg:mt-32 lg:gap-x-10">
          {/* Cocktail 01 — tall left column */}
          <div className="col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-5">
            <RevealImage
              src={FIRST.image}
              alt={`A ${FIRST.name} cocktail — ${FIRST.glass}`}
              parallax={0.06}
              className="aspect-[3/4] rounded-t-full"
            />
            <Reveal className="mt-8">
              <span className="font-serif text-[11px] italic text-gold">No. {FIRST.no}</span>
              <h3 className="mt-2 font-serif text-[clamp(1.7rem,2.6vw,2.6rem)] font-light leading-tight tracking-[-0.01em] text-ivory">
                {FIRST.name}
              </h3>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.36em] text-smoke">
                {FIRST.translation}
              </p>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.85] text-ivory/60">
                {FIRST.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                {FIRST.notes.map((note) => (
                  <span
                    key={note}
                    className="text-[9.5px] font-medium uppercase tracking-[0.34em] text-mist"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Cocktail 02 — offset right column, pushed down on desktop */}
          <div className="col-span-12 sm:col-span-10 sm:col-start-3 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7 lg:pt-28">
            {/* Decorative rule above second card — desktop only */}
            <Reveal className="mb-10 hidden items-center gap-6 lg:flex">
              <span aria-hidden className="h-px flex-1 bg-ivory/10" />
              <span className="font-serif text-[13px] italic text-gold/60">✦</span>
              <span aria-hidden className="h-px flex-1 bg-ivory/10" />
            </Reveal>

            <RevealImage
              src={SECOND.image}
              alt={`A ${SECOND.name} cocktail — ${SECOND.glass}`}
              parallax={0.05}
              className="aspect-[4/5] rounded-b-full"
            />
            <Reveal delay={80} className="mt-8">
              <span className="font-serif text-[11px] italic text-gold">No. {SECOND.no}</span>
              <h3 className="mt-2 font-serif text-[clamp(1.7rem,2.6vw,2.6rem)] font-light leading-tight tracking-[-0.01em] text-ivory">
                {SECOND.name}
              </h3>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.36em] text-smoke">
                {SECOND.translation}
              </p>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.85] text-ivory/60">
                {SECOND.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                {SECOND.notes.map((note) => (
                  <span
                    key={note}
                    className="text-[9.5px] font-medium uppercase tracking-[0.34em] text-mist"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* "Explore the Menu" subtle link */}
        <Reveal delay={200} className="mt-20 flex items-center gap-6 sm:mt-24 lg:mt-28">
          <span aria-hidden className="h-px w-10 bg-gold/40" />
          <Link
            to="/menu"
            className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory/60 transition-colors duration-500 hover:text-gold-soft"
          >
            <span className="link-line pb-1">Explore the Menu</span>
            <ArrowIcon className="h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
