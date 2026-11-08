import ProgressBadge from "./ProgressBadge";

export default function PublishingHero(){
  return(
    <section className="px-5 pt-8">
      <div className="flex justify-center">
        <ProgressBadge />
      </div>
      <h2 className="mt-8 font-serif text-[2.4rem] leading-tight text-loop-green-dark md:text-5xl">
        Putting Down your Roots...
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-loop-green">
        We're saving your buisness details and images, then preparing your public profile. Just a Moment!
      </p>
    </section>

  );
}