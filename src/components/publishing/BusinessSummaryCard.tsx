import Image from "next/image";
 
type Props = {
  name: string;
  location: string;
  imageSrc: string;
};
 
export default function BusinessSummaryCard({
  name,
  location,
  imageSrc,
}: Props) {
  return (
    <div className="flex items-center gap-3 px-5 pt-8">
      <Image
        src={imageSrc}
        alt={name}
        width={52}
        height={52}
        className="h-[52px] w-[52px] rounded-xl object-cover"
      />
      <div>
        <p className="text-base font-semibold text-[#1f2a24]">{name}</p>
        <p className="text-xs text-[#6b756e]">{location}</p>
      </div>
    </div>
  );
}