import Image from "next/image";
import { Badge } from "./Badge";
import { Card } from "./Card";

type ProfileCardProps = {
  name: string;
  role: string;
  focus: string;
  image: string;
};

export function ProfileCard({ name, role, focus, image }: ProfileCardProps) {
  return (
    <Card className="profile-card">
      <div className="blob">
        <Image src={image} alt={name} fill sizes="150px" style={{ objectFit: "cover" }} />
      </div>
      <div className="profile-info">
        <Badge>{role}</Badge>
        <strong>{name}</strong>
        <p>{focus}</p>
      </div>
    </Card>
  );
}
