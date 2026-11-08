export default function PublishingHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <img src="/icons/sprout-leaf.svg?v=8" alt="" className="h-8 w-8" />
        <h1 className="font-serif text-xl text-loop-green-dark">Publishing your Profile</h1>
      </div>
      <a href="#" className="text-xs text-loop-green">
        Help
      </a>
    </header>
  );
}