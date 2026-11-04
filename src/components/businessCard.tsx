import Link from "next/link";

type BusinessCardProps = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  location: string;
  description: string;
};

export default function businessCard( props: BusinessCardProps) {


  return (
    <div>
      <h2>{props.name}</h2><img> Business logo</img>
      <ul>
        <li>{props.category}</li>
        <li>{props.description}</li>
        <li>{props.location}</li>
      </ul>
            <Link href={`/business/${props.id}`}>View Business Profile</Link>
    </div>
  );
}