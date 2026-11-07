import Image from "next/image";
 
type Props = {
  iconSrc: string;
  title: string;
  description: string;
};
 
export default function PublishStepItem({ iconSrc, title, description }: Props) {
  return (
    <li className="flex items-start gap-3">
      <Image src={iconSrc} alt="" width={18} height={18} className="mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-[#1f2a24]">{title}</p>
        <p className="text-xs text-[#6b756e]">{description}</p>
      </div>
    </li>
  );
}