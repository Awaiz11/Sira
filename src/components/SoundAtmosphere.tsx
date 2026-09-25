import { cn } from "@/utils/cn";
import { Reveal, RevealImage, RevealLines } from "@/components/Reveal";
import { CONTAINER, Glow, SectionLabel } from "@/components/ui";
import lounge from "@/assets/gallery-lounge.jpg";

export function SoundAtmosphere() {
  return (
    <section
      id="sound-atmosphere"
      className="relative overflow-x-clip bg-charcoal pt-0 pb-0"
    >
      {/* Wide, edge-to-edge moody image */}
      <div className="relative w-full">
        <RevealImage
          src={lounge}
          alt="An oxblood velvet banquette beside a turntable and candlelit brass table at Sira"
          parallax={0.04}
          className="h-[56vw] min-h-[340px] max-h-[760px] w-full"
        />
        {/* Gradient fade at bottom to blend into content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal to-transparent"
        />
        {/* Subtle amber vignette overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,10,9,0.55)_100%)]"
        />
      </div>

      {/* Content block */}
      <div className={cn(CONTAINER, "relative pb-28 pt-16 sm:pb-36 sm:pt-20 lg:pb-48 lg:pt-24")}>
        <Glow className="-right-[30vw] top-0 h-[80vw] w-[80vw] lg:h-[50vw] lg:w-[50vw]" />
        <Glow tone="ember" className="-left-[20vw] bottom-0 h-[60vw] w-[60vw] lg:h-[35vw] lg:w-[35vw]" />

        <div className="relative grid grid-cols-12 gap-x-6 lg:gap-x-10">
          {/* Label column */}
          <div className="col-span-12 lg:col-span-3">
            <Reveal>
              <SectionLabel index="03">The Sound</SectionLabel>
            </Reveal>
          </div>

          {/* Main editorial content */}
          <div className="col-span-12 mt-14 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {/* Pull quote heading */}
            <RevealLines
              as="h2"
              className="font-serif text-[clamp(2.2rem,4.2vw,4.5rem)] font-light leading-[1.02] tracking-[-0.015em] text-ivory"
              lines={[
                "Vinyl only.",
                <>
                  No algorithm,{" "}
                  <em className="font-light italic text-gold-soft">no shuffle.</em>
                </>,
              ]}
            />

            {/* Body paragraphs */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14">
              <Reveal delay={80}>
                <p className="text-[15.5px] leading-[1.9] text-ivory/60 lg:text-[16px]">
                  Every night at Sira begins with a crate and a question: what does this room need?
                  Our resident selectors move through jazz, bossa nova, Ethiopian groove and Catalan
                  folk at the pace the evening demands — never louder than conversation.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-[15.5px] leading-[1.9] text-ivory/60 lg:text-[16px]">
                  The turntable sits at the bar's heart, visible from every seat. The needle
                  drop is deliberate. The warm crackle between tracks is not a flaw — it is
                  the silence that reminds you to be present, to taste slowly, to stay a
                  little longer.
                </p>
              </Reveal>
            </div>

            {/* Decorative detail line */}
            <Reveal delay={260} className="mt-12 flex items-center gap-6">
              <span aria-hidden className="h-px flex-1 bg-ivory/10 max-w-[3rem]" />
              <span className="text-[9.5px] font-medium uppercase tracking-[0.42em] text-smoke">
                33 ⅓ rpm — all night
              </span>
              <span aria-hidden className="h-px flex-1 bg-ivory/10" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
