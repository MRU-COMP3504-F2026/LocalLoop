"use client";

import { createContext, useContext, useState } from "react";

type ProductData = {
    productName: string;
    productType: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    productImageUrl: string;
};

type ProductContextType = {
    productData: ProductData;
    setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
};

const productContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = (props: { children: React.ReactNode }) => {

    const [productData, setProductData] = useState<ProductData>({
        productName: "",
        productType: "",
        productDescription: "",
        productPrice: 0,
        productQuantity: 0,
        productImageUrl: ""
    });

    return (
        <productContext.Provider value={{ productData, setProductData }}>
            {props.children}
        </productContext.Provider>
    );
};

export const useProduct = () => {

    const context = useContext(productContext);

    if (!context) {
        throw new Error("useProduct hook must be inside a ProductProvider");
    }

    return context;
};