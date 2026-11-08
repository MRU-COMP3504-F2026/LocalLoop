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
      <img
        src={imageSrc}
        alt=""
        className="h-[52px] w-[52px] rounded-full object-cover"
      />
      <div>
        <p className="font-serif text-2xl text-loop-green-dark">{name}</p>
        <p className="text-xs text-loop-green">{location}</p>
      </div>
    </div>
  );
}