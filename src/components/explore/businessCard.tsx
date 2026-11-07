import Link from "next/link";
import Image from "next/image";

interface BusinessCardProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  location: string;
  description: string;
}

export const BusinessCard = (props: BusinessCardProps) => {
  return (
    <article>
      <h2>{props.name}</h2>

      <Image
        src={props.imageUrl}
        alt={`${props.name} logo`}
        width={100}
        height={100}
      />

      <ul>
        <li>{props.category}</li>
        <li>{props.description}</li>
        <li>{props.location}</li>
      </ul>

      <Link href={`/business/${props.id}`}>
        View Business Profile
      </Link>
    </article>
  );
};