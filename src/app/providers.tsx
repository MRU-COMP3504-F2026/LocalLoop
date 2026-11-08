"use client";

import { AccountProvider } from "@/context/accounts/accountContext";
import { BusinessProvider } from "@/context/accounts/businessContext";
import { ProductProvider } from "@/context/productContext";
import { ServiceProvider } from "@/context/serviceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AccountProvider>
            <BusinessProvider>
                <ProductProvider>
                    <ServiceProvider>
                        {children}
                    </ServiceProvider>
                </ProductProvider>
            </BusinessProvider>
        </AccountProvider>
    );
}
