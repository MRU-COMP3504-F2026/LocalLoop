"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToProfile() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/profile");
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
