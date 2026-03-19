type QuoteBubbleProps = {
  text: string;
  className?: string;
};

export function QuoteBubble({ text, className }: QuoteBubbleProps) {
  return <div className={["quote-bubble", className].filter(Boolean).join(" ")}>{text}</div>;
}
