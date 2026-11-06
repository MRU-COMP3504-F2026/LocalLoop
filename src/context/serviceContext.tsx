"use client";

import {createContext, useContext,useState} from "react";

type serviceData = {
    serviceName: string;
    serviceType:string;
    serviceDescription: string;
    servicePrice: number;
    serviceQuantity: number;
    serviceImageUrl: string;
};

type serviceContextType = {
    serviceData: serviceData;
    setServiceData: (data: serviceData) => void;
};
const serviceContext = createContext<serviceContextType | undefined>(undefined);

export const serviceProvider = (props:{children: React.ReactNode})=>{
    const [serviceData, setServiceData] = useState<serviceData>({
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