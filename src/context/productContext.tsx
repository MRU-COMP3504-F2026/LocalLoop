"use client";

import {createContext, useContext,useState} from "react";

type productData = {
    productName: string;
    productType:string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    productImageUrl: string;
};

type productContextType = {
    productData: productData;
    setProductData: (data: productData) => void;
};
const productContext = createContext<productContextType | undefined>(undefined);

export const productProvider = (props:{children: React.ReactNode})=>{
    const [productData, setProductData] = useState<productData>({
        productName: "",
        productType:"",
        productDescription: "",
        productPrice: 0,
        productQuantity: 0,
        productImageUrl: ""
    });
    return (
        <productContext.Provider value ={{productData,setProductData}}>
            {props.children}
        </productContext.Provider>
    );
}

export const useProduct = () => {
    const context = useContext(productContext);
     if (!context) {
        throw new Error("useProduct hook must be inside a provider");
    }

    return context;
};