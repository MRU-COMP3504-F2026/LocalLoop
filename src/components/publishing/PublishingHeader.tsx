import Image from "next/image";

export default function PublishingHeader(){
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Image src="/icons/sprout-small.png" alt="" width={20} height={20}></Image>
        <h1 className="font-serif text-xl text-loop-green-dark">
            Publishing your Profile
        </h1>
      </div>
      <a href="#" className="text-xs text-loop-green"> Help</a>
    </header>

  );
}