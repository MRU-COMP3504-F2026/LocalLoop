import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
});

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-nunito",
});

export const metadata: Metadata = {
    title: "LocalLoop",
    description: "Find local. Love local.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${fraunces.variable} ${nunitoSans.variable} font-sans`}>
            <body className="min-h-screen bg-loop-cream font-sans text-loop-green-dark antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
