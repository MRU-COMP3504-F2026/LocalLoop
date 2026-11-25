// src/components/explore/businessCard.tsx
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
      <h2 className="font-serif text-xl text-loop-green-dark">{props.name}</h2>

      <Image
        src={props.imageUrl}
        alt={`${props.name} logo`}
        width={100}
        height={100}
        className="mt-3 h-24 w-24 rounded-2xl object-cover"
      />

      {props.category && (
        <span className="mt-3 inline-block rounded-full bg-loop-sage px-3 py-1.5 text-xs text-loop-green-dark">
          {props.category}
        </span>
      )}

      <ul className="mt-3 space-y-1 text-sm">
        <li className="text-loop-green-dark">{props.description}</li>
        <li className="text-loop-green">{props.location}</li>
      </ul>
      
      <Link
        href={`/business/${props.id}`}
        className="mt-4 inline-block text-sm font-semibold text-loop-green-dark hover:text-loop-green"
      >
        View Business Profile
      </Link>
    </article>
  );
};