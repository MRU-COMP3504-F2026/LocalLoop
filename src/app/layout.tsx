import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { BusinessProvider } from "@/context/accounts/businessContext";
import { AccountProvider } from "@/context/accounts/accountContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "LocalLoop",
  description: "LocalLoop",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen antialiased">
        <AccountProvider>
            <BusinessProvider>
            {children}
          </BusinessProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
