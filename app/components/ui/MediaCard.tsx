import Image from "next/image";

type MediaCardProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function MediaCard({ src, alt, className, priority = false, sizes }: MediaCardProps) {
  return (
    <div className={["media-card", className].filter(Boolean).join(" ")}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
