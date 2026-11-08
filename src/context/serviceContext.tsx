"use client";

import { createContext, useContext, useState } from "react";
import type { OfferingDetail } from "@/lib/offering";

export type ServiceData = {
    serviceName: string;
    serviceType: string;
    serviceDescription: string;
    servicePrice: number;
    serviceQuantity: number;
    images: File[];
    details: OfferingDetail[];
};

type ServiceContextType = {
    serviceData: ServiceData;
    setServiceData: React.Dispatch<React.SetStateAction<ServiceData>>;
    services: ServiceData[];
    editingIndex: number | null;
    addService: (service: ServiceData) => void;
    updateService: (index: number, service: ServiceData) => void;
    removeService: (index: number) => void;
    beginEdit: (index: number) => void;
    clearEdit: () => void;
};

const emptyService: ServiceData = {
    serviceName: "",
    serviceType: "",
    serviceDescription: "",
    servicePrice: 0,
    serviceQuantity: 1,
    images: [],
    details: [],
};

const serviceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = (props: { children: React.ReactNode }) => {
    const [serviceData, setServiceData] = useState<ServiceData>(emptyService);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    function addService(service: ServiceData) {
        if (!service.serviceName.trim()) return;
        setServiceData(service);
        setServices((current) => [...current, service]);
        setEditingIndex(null);
    }

    function updateService(index: number, service: ServiceData) {
        if (!service.serviceName.trim()) return;
        setServiceData(service);
        setServices((current) => current.map((item, itemIndex) => (itemIndex === index ? service : item)));
    }

    function removeService(index: number) {
        setServices((current) => current.filter((_, item) => item !== index));
        // deleting a row shifts whatever comes after it
        setEditingIndex((current) => {
            if (current === null) return null;
            if (current === index) return null;
            return current > index ? current - 1 : current;
        });
    }

    return (
        <serviceContext.Provider
            value={{
                serviceData,
                setServiceData,
                services,
                editingIndex,
                addService,
                updateService,
                removeService,
                beginEdit: setEditingIndex,
                clearEdit: () => setEditingIndex(null),
            }}
        >
            {props.children}
        </serviceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(serviceContext);

    if (!context) {
        throw new Error("useService hook must be inside a provider");
    }

    return context;
};
