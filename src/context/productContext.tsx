"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    deleteProductRow,
    insertProduct,
    listProducts,
    readBusinessId,
    updateProductRow,
} from "@/lib/database";
import type { OfferingDetail } from "@/lib/offering";

export type ProductData = {
    productId?: string;
    productName: string;
    productType: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    images: File[];
    details: OfferingDetail[];
    imageUrl?: string;
    persisted?: boolean;
};

type ProductContextType = {
    productData: ProductData;
    setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
    products: ProductData[];
    editingIndex: number | null;
    saveError: string | null;
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
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const businessId = readBusinessId();
        if (!businessId) return;

        let cancelled = false;
        listProducts(businessId)
            .then((rows) => {
                if (cancelled) return;
                setProducts((current) => (current.length > 0 ? current : rows));
            })
            .catch((error: Error) => {
                if (!cancelled) setSaveError(error.message);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function addProduct(product: ProductData) {
        if (!product.productName.trim()) return;
        const pending = { ...product, productId: crypto.randomUUID(), persisted: false };
        setProductData(pending);
        setProducts((current) => [...current, pending]);
        setEditingIndex(null);
        setSaveError(null);

        const businessId = readBusinessId();
        if (!businessId) return;

        void insertProduct(businessId, pending)
            .then((saved) => {
                setProducts((current) =>
                    current.map((item) =>
                        item.productId === pending.productId
                            ? { ...saved, images: item.images, details: item.details, productType: item.productType }
                            : item,
                    ),
                );
            })
            .catch((error: Error) => setSaveError(error.message));
    }

    function updateProduct(index: number, product: ProductData) {
        if (!product.productName.trim()) return;
        const existing = products[index];
        const next = {
            ...product,
            productId: product.productId ?? existing?.productId,
            imageUrl: product.imageUrl ?? existing?.imageUrl,
            persisted: product.persisted ?? existing?.persisted,
        };
        setProductData(next);
        setProducts((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)));
        setSaveError(null);

        if (!next.persisted || !next.productId) return;
        void updateProductRow(next).catch((error: Error) => setSaveError(error.message));
    }

    function removeProduct(index: number) {
        const existing = products[index];
        setProducts((current) => current.filter((_, item) => item !== index));
        setSaveError(null);
        if (existing?.persisted && existing.productId) {
            void deleteProductRow(existing.productId).catch((error: Error) => setSaveError(error.message));
        }
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
                saveError,
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
