"use client";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
};

const styles = {
  primary: "bg-loop-green text-white hover:bg-loop-green-dark",
  secondary: "bg-loop-cream text-loop-green border border-loop-border hover:bg-loop-sage",
  text: "text-loop-green hover:underline",
};

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-xl px-5 py-3.5 text-sm font-semibold disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}