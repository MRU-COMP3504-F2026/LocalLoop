"use client";

import { useState, type SubmitEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAccount } from "@/lib/auth";
import { useAccount } from "@/context/accounts/accountContext";
import AccountForm from "@/components/register/accountForm";
import { Button } from "@/components/ui/button";

export default function ShopperForm() {
  const router = useRouter();
  const { accountData } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (accountData.password !== accountData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (accountData.password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }

    setSaving(true);
    void signUpAccount({
      name: accountData.username,
      email: accountData.email,
      password: accountData.password,
      accountType: "client",
    })
      .then((account) => {
        if (account.needsConfirmation) {
          setNotice("Check your email and confirm the account, then sign in.");
          setSaving(false);
          return;
        }
        router.push("/explore");
      })
      .catch((signUpError: Error) => {
        setError(signUpError.message);
        setSaving(false);
      });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl rounded-[28px] bg-white p-5 md:p-7">
      <AccountForm accountType="client" />
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-loop-green">{notice}</p> : null}
      <Button
        type="submit"
        disabled={saving}
        className="mt-6 h-auto rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white hover:bg-loop-green"
      >
        {saving ? "Saving..." : "Create shopper profile"}
      </Button>
      <p className="mt-4 text-sm text-loop-green">
        Already have an profile?{" "}
        <Link href="/login" className="font-semibold text-loop-green-dark underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
