import { cn } from "@/utils/cn";
import { images } from "@/data/content";
import { Reveal, RevealImage, RevealLines } from "@/components/Reveal";
import { CONTAINER, Glow, SectionLabel } from "@/components/ui";

const DETAILS: { value: string; fraction?: [string, string]; label: string }[] = [
  { value: "40", label: "Seats — never more" },
  { value: "300+", label: "Rare & Catalan spirits" },
  { value: "33", fraction: ["1", "3"], label: "Vinyl only, all night" },
  { value: "03:00", label: "Last call, Fri & Sat" },
];

function Caption({ fig, children, time }: { fig: string; children: string; time: string }) {
  return (
    <Reveal className="mt-5 flex items-baseline justify-between gap-6 text-[10px] font-medium uppercase tracking-[0.32em] text-smoke">
      <span>
        <span className="mr-2 font-serif text-[15px] font-normal italic normal-case tracking-normal text-gold">Fig. {fig}</span>—{" "}
        {children}
      </span>
      <span>{time}</span>
    </Reveal>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative overflow-x-clip bg-charcoal pt-28 pb-0 sm:pt-36 sm:pb-0 lg:pt-48 lg:pb-0 mb-12">
      <Glow className="-right-[25vw] top-[4%] h-[70vw] w-[70vw] lg:h-[55vw] lg:w-[55vw]" />
      <Glow tone="ember" className="-left-[30vw] bottom-[8%] h-[70vw] w-[70vw] lg:h-[50vw] lg:w-[50vw]" />

      <div className={cn(CONTAINER, "relative")}>
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <SectionLabel index="01">The Experience</SectionLabel>
          </Reveal>
          <Reveal delay={120} className="hidden text-[10px] font-medium uppercase tracking-[0.42em] text-smoke md:block">
            Est. MMXIX — Barcelona
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 sm:mt-20 lg:mt-24 lg:gap-x-10 lg:gap-y-0">
          {/* Headline */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-10">
            <RevealLines
              className="font-serif text-[clamp(2.6rem,5.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-ivory"
              lines={[
                "Behind an unmarked",
                "door in El Born,",
                <>
                  the city <em className="font-light italic text-gold-soft">lowers</em>
                </>,
                <em key="v" className="font-light italic text-gold-soft">
                  its voice.
                </em>,
              ]}
            />
          </div>

          {/* Arched portrait */}
          <div className="col-span-12 sm:col-span-10 md:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <RevealImage
              src={images.experiencePour}
              alt="A bartender pours an amber cocktail through a gold strainer into a chilled coupe"
              parallax={0.07}
              className="aspect-[4/5] rounded-t-full"
            />
            <Caption fig="01" time="21:40">
              The final stir
            </Caption>
          </div>

          {/* Story */}
          <div className="col-span-12 md:col-span-9 md:col-start-3 lg:col-span-5 lg:col-start-7 lg:row-start-2 lg:pt-16">
            <Reveal>
              <p className="text-[15.5px] leading-[1.9] text-ivory/65 lg:text-[16.5px]">
                Sira is a room made for lingering. Amber light pools across hand-plastered vaults, a turntable fills the
                pauses between conversations, and every drink is stirred, shaken and poured within arm's reach of your
                seat.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-[15.5px] leading-[1.9] text-ivory/65 lg:text-[16.5px]">
                Our bar follows the Mediterranean seasons — Catalan growers, coastal botanicals and a quiet library of
                rare spirits, composed into drinks that taste of a place: salt from Barceloneta, smoke from a summer
                verbena, the bitterness of winter citrus.
              </p>
            </Reveal>
            <Reveal delay={220} className="mt-11 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-serif text-[2rem] font-light italic leading-none text-gold-soft">Núria Vidal</span>
              <span aria-hidden className="h-px w-8 bg-ivory/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-mist">Founder & Head of Bar</span>
            </Reveal>
          </div>

          {/* Pull quote */}
          <div className="col-span-12 md:col-span-10 lg:col-span-5 lg:col-start-1 lg:row-start-3 lg:self-center lg:pt-28">
            <Reveal blur>
              <blockquote className="relative pl-1 font-serif text-[clamp(2.1rem,3.5vw,3.4rem)] font-light italic leading-[1.08] text-ivory/90">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-1 -top-[0.62em] select-none font-serif text-[2.6em] not-italic leading-none text-gold/25 lg:-left-[0.45em]"
                >
                  “
                </span>
                Not a bar you pass by — a bar you <span className="text-gold-soft">find.</span>
              </blockquote>
            </Reveal>
          </div>

          {/* Detail image */}
          <div className="col-span-11 col-start-2 sm:col-span-8 sm:col-start-5 lg:col-span-6 lg:col-start-7 lg:row-start-3 lg:pt-32">
            <RevealImage
              src={images.experienceDetail}
              alt="Candlelight and a crystal rocks glass with a clear ice block on a dark marble table"
              parallax={0.05}
              className="aspect-[3/2] rounded-[4px]"
            />
            <Caption fig="02" time="23:05">
              Candlelight, table four
            </Caption>
          </div>
        </div>

        {/* House details */}
        <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-14 sm:mt-28 lg:mt-40 lg:grid-cols-4 lg:gap-x-10">
          {DETAILS.map((item, i) => (
            <Reveal key={item.label} delay={i * 110}>
              <span aria-hidden className="mb-7 block h-px w-7 bg-gold/60" />
              <p className="font-serif text-[clamp(2.9rem,4.8vw,4.6rem)] font-light leading-none tracking-[-0.01em] text-ivory">
                {item.value}
                {item.fraction && (
                  <>
                    <span className="sr-only"> and one third</span>
                    {/* Hand-set stacked fraction — baseline sits on the figures' baseline */}
                    <span
                      aria-hidden
                      className="ml-[0.07em] inline-block text-center align-baseline text-[0.3em] font-normal leading-[1.1] text-gold-soft"
                    >
                      <span className="block">{item.fraction[0]}</span>
                      <span className="mx-auto my-[0.14em] block h-px w-[1.25em] bg-current opacity-60" />
                      <span className="block">{item.fraction[1]}</span>
                    </span>
                  </>
                )}
              </p>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.32em] text-mist">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
