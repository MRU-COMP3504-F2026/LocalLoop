export default function PageFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-loop-cream text-loop-green-dark md:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 md:px-8 lg:px-10">
        <header>
          {eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-loop-green">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-md text-loop-green md:text-lg">{description}</p>
          ) : null}
        </header>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </main>
  );
}
