"use client";

import { createContext, useContext, useState } from "react";
import type { OfferingDetail } from "@/lib/offering";

export type ProductData = {
    productName: string;
    productType: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    images: File[];
    details: OfferingDetail[];
};

type ProductContextType = {
    productData: ProductData;
    setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
    products: ProductData[];
    editingIndex: number | null;
    addProduct: (product: ProductData) => void;
    updateProduct: (index: number, product: ProductData) => void;
    removeProduct: (index: number) => void;
    beginEdit: (index: number) => void;
    clearEdit: () => void;
};

const emptyProduct: ProductData = {
    productName: "",
    productType: "",
    productDescription: "",
    productPrice: 0,
    productQuantity: 1,
    images: [],
    details: [],
};

const productContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = (props: { children: React.ReactNode }) => {
    const [productData, setProductData] = useState<ProductData>(emptyProduct);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    function addProduct(product: ProductData) {
        if (!product.productName.trim()) return;
        setProductData(product);
        setProducts((current) => [...current, product]);
        setEditingIndex(null);
    }

    function updateProduct(index: number, product: ProductData) {
        if (!product.productName.trim()) return;
        setProductData(product);
        setProducts((current) => current.map((item, itemIndex) => (itemIndex === index ? product : item)));
    }

    function removeProduct(index: number) {
        setProducts((current) => current.filter((_, item) => item !== index));
        // deleting a row shifts whatever comes after it
        setEditingIndex((current) => {
            if (current === null) return null;
            if (current === index) return null;
            return current > index ? current - 1 : current;
        });
    }

    return (
        <productContext.Provider
            value={{
                productData,
                setProductData,
                products,
                editingIndex,
                addProduct,
                updateProduct,
                removeProduct,
                beginEdit: setEditingIndex,
                clearEdit: () => setEditingIndex(null),
            }}
        >
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
