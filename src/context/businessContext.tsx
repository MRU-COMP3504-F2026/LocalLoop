"use client";

import { createContext, useContext, useState } from "react";

type BusinessData = {
    businessName: string;
    email: string;
    password: string;
    confirmPass: string;
    location: string;
    category: string[];
    description: string;
    onlineStore: string;
    openingHours: string;
    images: File[];
};

type BusinessContextType = {
    businessData: BusinessData;
    setBusinessData: (data: BusinessData) => void;
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = (props: { children: React.ReactNode }) => {
    const [businessData, setBusinessData] = useState<BusinessData>({
        businessName: "",
        email: "",
        password: "",
        confirmPass: "",
        location: "",
        category: [],
        description: "",
        onlineStore: "",
        openingHours: "",
        images: [],
    });

    return (
        <BusinessContext.Provider value={{ businessData, setBusinessData }}>
            {props.children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => {
    const context = useContext(BusinessContext);
     if (!context) {
        throw new Error("useBusiness hook must be inside a provider");
    }

    return context;
};