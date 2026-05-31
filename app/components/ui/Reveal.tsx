import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealVariant = "up" | "left" | "right" | "scale" | "fade";

/**
 * Ergonomic scroll-reveal wrapper. The global RevealObserver toggles
 * data-reveal-state on `.reveal` elements; this just adds the right classes
 * and stagger index. Renders visible by default (no JS / reduced motion safe).
 */
export function Reveal({
  as,
  variant = "up",
  index,
  className,
  style,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  index?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag = as ?? "div";
  const classes = ["reveal", variant !== "up" ? `reveal--${variant}` : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={classes}
      style={index !== undefined ? ({ "--i": index, ...style } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
