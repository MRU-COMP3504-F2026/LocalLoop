"use client";

import { ProductProvider } from "@/context/productContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ProductProvider>
            {children}
        </ProductProvider>
    );
}