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

        <div className="mt-10 flex w-full flex-col gap-3">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full border border-loop-border bg-white px-5 text-sm font-semibold text-loop-green-dark hover:bg-loop-sage"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-full bg-loop-green-dark px-5 text-sm font-semibold text-white hover:bg-loop-green"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
