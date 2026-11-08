import Image from "next/image";
 
// The big circle with the sprout icon in the middle.
export default function ProgressBadge() {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#d6e0cc] bg-[#e8eede]">
      <Image src="/icons/sprout.png" alt="" width={36} height={36} />
    </div>
  );
}
 