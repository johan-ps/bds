import type { ReactNode } from "react";

type HeroProps = {
  children: ReactNode;
  className?: string;
};

export function Hero({ children, className }: HeroProps) {
  return <section className={["hero", className].filter(Boolean).join(" ")}>{children}</section>;
}
