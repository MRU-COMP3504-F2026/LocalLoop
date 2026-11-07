
"use client";

import { createContext, useContext, useState } from "react";

type DaySchedule = {
    open: string;
    close: string;
    closed: boolean;
};

export type BusinessHours = {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
};

type BusinessData = {
    location: string;
    category: string[];
    description: string;
    onlineStore: string;
    openingHours: BusinessHours;
    images: File[];
};

type BusinessContextType = {
    businessData: BusinessData;
    setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>;
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = (props: { children: React.ReactNode }) => {
    const [businessData, setBusinessData] = useState<BusinessData>({
        location: "",
        category: [],
        description: "",
        onlineStore: "",
        images: [],
        openingHours: {
            monday: { open: "09:00", close: "17:00", closed: false },
            tuesday: { open: "09:00", close: "17:00", closed: false },
            wednesday: { open: "09:00", close: "17:00", closed: false },
            thursday: { open: "09:00", close: "17:00", closed: false },
            friday: { open: "09:00", close: "17:00", closed: false },
            saturday: { open: "09:00", close: "17:00", closed: true },
            sunday: { open: "09:00", close: "17:00", closed: true },
        },
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
        throw new Error("useBusiness must be used inside BusinessProvider");
    }

    return context;
};
