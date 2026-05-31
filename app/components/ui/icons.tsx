import type { SVGProps } from "react";

type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "play"
  | "star"
  | "check"
  | "sparkle"
  | "phone"
  | "mail"
  | "pin"
  | "clock"
  | "calendar"
  | "users"
  | "music"
  | "trophy"
  | "heart"
  | "send"
  | "quote"
  | "chevron-left"
  | "chevron-right"
  | "menu"
  | "close"
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x"
  | "globe"
  | "compass"
  | "flame"
  | "layers";

const PATHS: Record<IconName, string> = {
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  play: "M8 5v14l11-7z",
  star: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z",
  check: "M20 6 9 17l-5-5",
  sparkle: "M12 3l1.8 4.9L19 9.7l-4.2 2.2L12 17l-2.8-5.1L5 9.7l5.2-1.8z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L17 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-1z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 21s-7-5.7-7-11a7 7 0 1 1 14 0c0 5.3-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  calendar: "M3 5h18v16H3zM3 9h18M8 3v4M16 3v4",
  users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-1a4 4 0 0 0-3-3.8M16 4.2a3.5 3.5 0 0 1 0 6.6",
  music: "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  trophy: "M8 4h8v4a4 4 0 0 1-8 0zM8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 14h4l1 6H9z",
  heart: "M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  quote: "M7 7H4v6h3l-1 4h2l2-4V7zm10 0h-3v6h3l-1 4h2l2-4V7z",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01",
  facebook: "M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.5c0-.4.3-.5.5-.5z",
  youtube: "M22 12s0-3-.4-4.3a2.6 2.6 0 0 0-1.8-1.8C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.8.4A2.6 2.6 0 0 0 2.4 7.7C2 9 2 12 2 12s0 3 .4 4.3a2.6 2.6 0 0 0 1.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15 22 12 22 12zM10 9.5l5 2.5-5 2.5z",
  tiktok: "M15 4c.5 2.5 2 4 4.5 4.2v3C17.8 11 16.3 10.4 15 9.4V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1A2.5 2.5 0 1 0 12 15V4z",
  x: "M4 4l16 16M20 4 4 20",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-6-3.5-9S9.5 5.5 12 3z",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM16 8l-2 6-6 2 2-6z",
  flame: "M12 3c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5C16 10 17 12 17 14a5 5 0 0 1-10 0c0-4 5-6 5-11z",
  layers: "M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 18l10 5 10-5",
};

export type { IconName };

export function Icon({
  name,
  size = 20,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const filled = name === "play" || name === "star" || name === "quote";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
