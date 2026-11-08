import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-center bg-loop-cream px-6 py-10 text-loop-green-dark">
      <div className="flex w-full max-w-[430px] flex-col items-center text-center">
        <img src="/images/logo.png" alt="" className="mt-4 h-32 w-auto" />
        <h1 className="mt-5">
          <img
            src="/images/wordmark.png"
            alt="LocalLoop. Find local. Love local."
            className="h-auto w-[280px] max-w-full"
          />
        </h1>

        <h2 className="mt-12 font-serif text-[2rem] leading-tight">Find local. Love local.</h2>
        <p className="mt-3 max-w-sm text-loop-green">
          Meet the makers, little shops and local moments that make your neighborhood yours.
        </p>

        <Link
          href="/explore"
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-loop-green-dark px-5 text-sm font-semibold text-white hover:bg-loop-green"
        >
          Use my location
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="12" cy="11" r="2.1" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </Link>

        <Link href="/explore" className="mt-5 text-sm font-semibold hover:text-loop-green">
          Choose a neighborhood instead
        </Link>

        <p className="mt-6 max-w-xs text-xs leading-relaxed text-loop-green">
          Your location helps us find nearby gems. It&apos;s never shared with businesses.
        </p>

        <p className="mt-10 text-sm">
          Own a local business?{" "}
          <Link href="/register" className="font-semibold hover:text-loop-green">
            Join the loop →
          </Link>
        </p>
      </div>
    </main>
  );
}
