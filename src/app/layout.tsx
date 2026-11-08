import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "LocalLoop",
    description: "LocalLoop",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body className="min-h-screen antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
