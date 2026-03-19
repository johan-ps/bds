import type { ReactNode } from "react";

type HeroProps = {
  children: ReactNode;
  className?: string;
};

export function Hero({ children, className }: HeroProps) {
  return <div className={["hero", className].filter(Boolean).join(" ")}>{children}</div>;
}
