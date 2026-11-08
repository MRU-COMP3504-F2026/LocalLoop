"use client";

import { createContext, useContext, useState } from "react";

export type ProductData = {
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
    products: ProductData[];
    addProduct: (product: ProductData) => void;
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
    const [products, setProducts] = useState<ProductData[]>([]);

    function addProduct(product: ProductData) {
        if (!product.productName.trim()) return;
        setProductData(product);
        setProducts((current) => [...current, product]);
    }

    return (
        <productContext.Provider value={{ productData, setProductData, products, addProduct }}>
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