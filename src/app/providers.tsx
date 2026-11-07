"use client";

import { ProductProvider } from "@/context/productContext";
import { ServiceProvider } from "@/context/serviceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ProductProvider>
            <ServiceProvider>
                {children}
            </ServiceProvider>
        </ProductProvider>
    );
}