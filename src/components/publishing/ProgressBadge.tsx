export default function ProgressBadge() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="42" fill="#E5EBDD" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#243C2E"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset="72"
          transform="rotate(-90 50 50)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="72"
            to="0"
            dur="7s"
            fill="freeze"
          />
        </circle>
      </svg>
      <img src="/icons/sprout-leaf.svg?v=8" alt="" className="relative h-11 w-11" />
    </div>
  );
}
