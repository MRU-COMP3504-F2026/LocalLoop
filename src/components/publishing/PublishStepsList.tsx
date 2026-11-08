import PublishStepItem from "./PublishStepItem";
 
export default function PublishStepsList() {
  return (
    <section className="mx-5 mt-6 rounded-2xl bg-[#e8eede] p-4">
      <ul className="flex flex-col gap-5">
        <PublishStepItem
          iconSrc="/icons/spinner.png"
          title="Saving business details"
          description="Account, location and offerings"
        />
        <PublishStepItem
          iconSrc="/icons/image.png"
          title="Saving profile images"
          description="Banner, profile picture and offering photos"
        />
        <PublishStepItem
          iconSrc="/icons/globe.png"
          title="Preparing your public profile"
          description="Making your studio ready for discovery"
        />
      </ul>
    </section>
  );
}