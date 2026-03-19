import type { CSSProperties, ReactNode } from "react";

type HeroFrameProps = {
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
};

export function HeroFrame({ children, className, backgroundImage }: HeroFrameProps) {
  const style = backgroundImage
    ? ({ "--hero-bg": `url(${backgroundImage})` } as CSSProperties)
    : undefined;

  return (
    <section className={["hero-frame", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </section>
  );
}
