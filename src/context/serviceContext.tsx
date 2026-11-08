"use client";

import {createContext, useContext,useState} from "react";

type ServiceData = {
    serviceName: string;
    serviceType:string;
    serviceDescription: string;
    servicePrice: number;
    serviceQuantity: number;
    serviceImageUrl: string;
};

type ServiceContextType = {
    serviceData: ServiceData;
    setServiceData: React.Dispatch<React.SetStateAction<ServiceData>>;
};

const serviceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = (props:{children: React.ReactNode})=>{
    const [serviceData, setServiceData] = useState<ServiceData>({
        serviceName: "",
        serviceType:"",
        serviceDescription: "",
        servicePrice: 0,
        serviceQuantity: 0,
        serviceImageUrl: ""
    });
    return (
        <serviceContext.Provider value ={{serviceData,setServiceData}}>
            {props.children}
        </serviceContext.Provider>
    );
}

export const useService = () => {
    const context = useContext(serviceContext);
     if (!context) {
        throw new Error("useService hook must be inside a provider");
    }

    return context;
};