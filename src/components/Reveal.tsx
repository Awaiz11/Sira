import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useInView, useParallax } from "@/hooks/motion";

const delayStyle = (ms: number, extra?: CSSProperties) => ({ "--delay": `${ms}ms`, ...extra }) as CSSProperties;

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  blur?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Soft fade-and-rise when the element scrolls into view. */
export function Reveal({ children, as = "div", delay = 0, blur = false, className, style }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={cn("reveal", blur && "reveal-blur", inView && "is-visible", className)}
      style={delayStyle(delay, style)}
    >
      {children}
    </Tag>
  );
}

type RevealLinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Headline whose lines rise, one after another, out of a hidden mask. */
export function RevealLines({ lines, as = "h2", className, delay = 0, stagger = 110 }: RevealLinesProps) {
  const [ref, inView] = useInView<HTMLHeadingElement>({ threshold: 0.25 });
  const Tag = as as "h2";

  return (
    <Tag ref={ref} className={cn(inView && "is-visible", className)}>
      {lines.map((line, i) => (
        <span key={i} className="line">
          <span style={delayStyle(delay + i * stagger)}>
            {line}{" "}
          </span>
        </span>
      ))}
    </Tag>
  );
}

type RevealImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  delay?: number;
  children?: ReactNode;
};

/**
 * Image unveiled like a rising curtain, settling out of a slow zoom.
 * The observed frame stays unclipped (IntersectionObserver ignores fully
 * clipped targets); the curtain clip-path lives on an inner layer.
 */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = 0,
  delay = 0,
  children,
}: RevealImageProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12 });
  const parallaxRef = useParallax<HTMLDivElement>(parallax);

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      <div className={cn("img-reveal absolute inset-0 bg-soot", inView && "is-visible")} style={delayStyle(delay)}>
        <div
          ref={parallax ? parallaxRef : undefined}
          className={cn("absolute inset-x-0 will-change-transform", parallax ? "-top-[14%] -bottom-[14%]" : "inset-y-0")}
        >
          <img
            src={src}
            alt={alt}
            decoding="async"
            draggable={false}
            className={cn("img-reveal-inner h-full w-full object-cover", imgClassName)}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
