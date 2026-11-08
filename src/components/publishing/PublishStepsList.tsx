import PublishStepItem from "./PublishStepItem";
 
export default function PublishStepsList() {
  return (
    <section className="mx-5 mt-6 rounded-[28px] bg-loop-sage p-5">
      <ul className="flex flex-col gap-5">
        <PublishStepItem
          iconSrc="/icons/spinner.svg"
          title="Saving business details"
          description="Account, location and offerings"
        />
        <PublishStepItem
          iconSrc="/icons/image.svg"
          title="Saving profile images"
          description="Banner, profile picture and offering photos"
        />
        <PublishStepItem
          iconSrc="/icons/globe.svg"
          title="Preparing your public profile"
          description="Making your studio ready for discovery"
        />
      </ul>
    </section>
  );
}