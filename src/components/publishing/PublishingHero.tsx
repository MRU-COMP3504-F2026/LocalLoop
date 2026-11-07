import ProgressBadge from "./ProgressBadge";

export default function PublishingHero(){
  return(
    <section className="px-5 pt-8">
      <div className="flex justify-center">
        <ProgressBadge />
      </div>
      <h2 className="mt-8 text-3xl font-bold leading-tight text-[#1f2a24]">
        Putting Down your Roots...
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#6b756e]">
        We're saving your buisness details and images, then preparing your public profile. Just a Moment!
      </p>
    </section>

  );
}