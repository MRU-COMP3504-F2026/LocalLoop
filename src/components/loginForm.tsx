"use client";

import { useState, type SubmitEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAccount, signOutAccount } from "@/lib/auth";
import { accountTypesForEmail, clearBusinessId, getBusinessByEmail, writeBusinessId } from "@/lib/database";

type LoginFormProps = {
  accountType: "business" | "client";
};

export default function LoginForm({ accountType }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isBusiness = accountType === "business";

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    void signInAccount(email, password)
      .then(async (session) => {
        const address = session?.user.email ?? email;
        const [types, business] = await Promise.all([
          accountTypesForEmail(address),
          getBusinessByEmail(address),
        ]);

        if (isBusiness) {
          if (!types.includes("business") && !business) {
            await signOutAccount();
            throw new Error("That email isn't a business account.");
          }
          if (business) writeBusinessId(business.business_id);
          router.push("/dashboard");
          return;
        }

        if (!types.includes("client")) {
          await signOutAccount();
          throw new Error("That email isn't a shopper account.");
        }
        clearBusinessId();
        router.push("/explore");
      })
      .catch((signInError: Error) => {
        setError(signInError.message);
        setSaving(false);
      });
  };

  return (
    <form onSubmit={onSubmit} className="w-full rounded-[28px] bg-white p-5">
      <label className="block text-sm">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl bg-loop-cream px-4 text-base outline-none"
        />
      </label>
      <label className="mt-4 block text-sm">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl bg-loop-cream px-4 text-base outline-none"
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
      <p className="mt-4 text-sm text-loop-green">
        Need an account?{" "}
        <Link
          href={isBusiness ? "/register/business" : "/register/customer"}
          className="font-semibold text-loop-green-dark underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
