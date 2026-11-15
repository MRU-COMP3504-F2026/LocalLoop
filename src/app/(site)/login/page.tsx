"use client";

import { useState, type SubmitEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAccount } from "@/lib/auth";
import { getBusinessByEmail, writeBusinessId } from "@/lib/database";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    void signInAccount(email, password)
      .then(async (session) => {
        const address = session?.user.email ?? email;
        const business = await getBusinessByEmail(address);
        if (business) {
          writeBusinessId(business.business_id);
          router.push("/dashboard");
          return;
        }
        router.push("/explore");
      })
      .catch((signInError: Error) => {
        setError(signInError.message);
        setSaving(false);
      });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-16 pb-28 text-loop-green-dark">
      <p className="text-sm uppercase tracking-[0.2em] text-loop-green">welcome back</p>
      <h1 className="mt-3 font-serif text-[2.4rem] leading-tight">sign in</h1>
      <p className="mt-3 text-loop-green">Use the email and password from your account.</p>

      <form onSubmit={onSubmit} className="mt-8 rounded-[28px] bg-white p-5">
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl bg-loop-cream px-4 outline-none"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl bg-loop-cream px-4 outline-none"
          />
        </label>
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white hover:bg-loop-green"
        >
          {saving ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-loop-green">
        Need an account?{" "}
        <Link href="/register" className="font-semibold text-loop-green-dark underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
