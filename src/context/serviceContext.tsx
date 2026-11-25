"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    deleteServiceRow,
    insertService,
    listServices,
    readBusinessId,
    updateServiceRow,
} from "@/lib/database";
import type { OfferingDetail } from "@/lib/offering";

export type ServiceData = {
    serviceId?: string;
    serviceName: string;
    serviceType: string;
    serviceDescription: string;
    servicePrice: number;
    serviceQuantity: number;
    images: File[];
    details: OfferingDetail[];
    imageUrl?: string;
    persisted?: boolean;
};

type ServiceContextType = {
    serviceData: ServiceData;
    setServiceData: React.Dispatch<React.SetStateAction<ServiceData>>;
    services: ServiceData[];
    editingIndex: number | null;
    saveError: string | null;
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
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const businessId = readBusinessId();
        if (!businessId) return;

        let cancelled = false;
        listServices(businessId)
            .then((rows) => {
                if (cancelled) return;
                setServices((current) => (current.length > 0 ? current : rows));
            })
            .catch((error: Error) => {
                if (!cancelled) setSaveError(error.message);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function addService(service: ServiceData) {
        if (!service.serviceName.trim()) return;
        const pending = { ...service, serviceId: crypto.randomUUID(), persisted: false };
        setServiceData(pending);
        setServices((current) => [...current, pending]);
        setEditingIndex(null);
        setSaveError(null);

        const businessId = readBusinessId();
        if (!businessId) return;

        void insertService(businessId, pending)
            .then((saved) => {
                setServices((current) =>
                    current.map((item) =>
                        item.serviceId === pending.serviceId
                            ? { ...saved, images: item.images, details: item.details, serviceType: item.serviceType }
                            : item,
                    ),
                );
            })
            .catch((error: Error) => setSaveError(error.message));
    }

    function updateService(index: number, service: ServiceData) {
        if (!service.serviceName.trim()) return;
        const existing = services[index];
        const next = {
            ...service,
            serviceId: service.serviceId ?? existing?.serviceId,
            imageUrl: service.imageUrl ?? existing?.imageUrl,
            persisted: service.persisted ?? existing?.persisted,
        };
        setServiceData(next);
        setServices((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)));
        setSaveError(null);

        if (!next.persisted || !next.serviceId) return;
        void updateServiceRow(next).catch((error: Error) => setSaveError(error.message));
    }

    function removeService(index: number) {
        const existing = services[index];
        setServices((current) => current.filter((_, item) => item !== index));
        setSaveError(null);
        if (existing?.persisted && existing.serviceId) {
            void deleteServiceRow(existing.serviceId).catch((error: Error) => setSaveError(error.message));
        }
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
                saveError,
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
