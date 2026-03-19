import Image from "next/image";

type ImageTileProps = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  tag?: string;
};

export function ImageTile({ src, alt, title, subtitle, tag }: ImageTileProps) {
  const hasContent = Boolean(title || subtitle || tag);
  const className = ["image-tile", !hasContent && "image-tile--plain"].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
      <div className="image-tile__overlay" />
      {hasContent ? (
        <div className="image-tile__content">
          {tag ? <span className="image-tile__tag">{tag}</span> : null}
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
