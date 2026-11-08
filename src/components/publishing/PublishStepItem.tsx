type Props = {
  iconSrc: string;
  title: string;
  description: string;
};

export default function PublishStepItem({ iconSrc, title, description }: Props) {
  return (
    <li className="flex items-start gap-3">
      <img src={iconSrc} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-loop-green-dark">{title}</p>
        <p className="text-xs text-loop-green">{description}</p>
      </div>
    </li>
  );
}