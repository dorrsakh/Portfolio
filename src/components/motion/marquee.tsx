// beui.dev/components/motion/marquee
import { Children, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  speed?: number;
  pauseOnHover?: boolean;
  gap?: string;
  className?: string;
  fade?: boolean;
  label?: string;
}

export function Marquee({
  children,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  gap = "1rem",
  className,
  fade = true,
  label,
}: MarqueeProps) {
  const vertical = direction === "up" || direction === "down";
  const reverse = direction === "right" || direction === "down";
  const items = Children.toArray(children);

  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      data-orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        "group relative flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        fade &&
          !vertical &&
          "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        fade &&
          vertical &&
          "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
      // gap on the wrapper too, so the seam between the two tracks matches the
      // spacing between items and the loop stays even.
      style={{ "--gap": gap, gap } as CSSProperties}
    >
      {[0, 1].map((dup) => (
        <div
          key={dup}
          aria-hidden={dup === 1}
          inert={dup === 1}
          style={{
            animationDuration: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
            gap,
          }}
          className={cn(
            "flex shrink-0 items-center justify-around",
            vertical ? "min-h-full" : "min-w-full",
            vertical
              ? "flex-col animate-marquee-vertical"
              : "flex-row animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            "group-focus-within:[animation-play-state:paused]",
          )}
        >
          {items.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Marquee duplicates static child slots; item order is not mutated.
            <div key={i} className="shrink-0">
              {child}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
