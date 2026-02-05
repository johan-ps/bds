import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  className?: string;
};

export function Chip({ children, className }: ChipProps) {
  return <span className={["chip", className].filter(Boolean).join(" ")}>{children}</span>;
}
