import Image from "next/image";

export default function PublishingHeader(){
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Image src="/icons/sprout-small.png" alt="" width={20} height={20}></Image>
        <h1 className="text-base font-semibold text-[#1f2a24]">
            Publishing your Profile
        </h1>
      </div>
      <a href="#" className="text-xs text-[#6b756e]"> Help</a>
    </header>

  );
}