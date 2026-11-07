
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "LocalLoop",
    description: "LocalLoop",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body className="min-h-screen antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
