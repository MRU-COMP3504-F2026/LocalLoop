"use client"

import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useService } from "@/context/serviceContext";

export default function ServiceRegistrationForm(){
    const {serviceData, setServiceData} = useService();

    const [formData, setFormData] = useState({
        serviceName: serviceData.serviceName,
        serviceType: serviceData.serviceType,
        serviceDescription: serviceData.serviceDescription,
        servicePrice: serviceData.servicePrice,
        serviceQuantity: serviceData.serviceQuantity,
        serviceImageUrl: serviceData.serviceImageUrl
    });
    const handleChange =(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)=>{
        const {name, value} =e.target;
        setFormData({
            ...formData,
            [name]: 
                name === "servicePrice" || name === "serviceQuantity"
                    ? Number(value)
                    : value
        });
    };
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServiceData(formData);
        console.log("Service registered:", formData);
    };
    const inputStyle = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
    const labelStyle = "mb-2 block text-sm font-medium text-gray-700";

    return(
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Register a Service
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your Service information below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div>
                        <label className={labelStyle}>
                            Service Name
                        </label>
                        <input type="text"  name = "serviceName" placeholder ="Enter service name" value={formData.serviceName} onChange={handleChange} className={inputStyle}/>
                    </div>

                    <div>
                        <label className={labelStyle}>
                            Service Type
                        </label>
                        <select name = "serviceType" value = {formData.serviceType} onChange={handleChange} className= {inputStyle} required>
                            <option value="">Select Service Type</option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                        </select>
                    </div>
                    
                    <div>
                        <label className={labelStyle}>
                            Service Description
                        </label>
                          <textarea name="serviceDescription" placeholder="Describe your Service..." value={formData.serviceDescription} onChange={handleChange} rows={4} className={inputStyle + " resize-none"} required/>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"> 
                        <div>
                            <label >
                                Price ($)
                            </label>
                            <input type="number" name="servicePrice" placeholder="0.00" value={formData.servicePrice} onChange={handleChange} min="0" step="0.01" className={inputStyle} required/>
                        </div>

                        <div>
                            <input type="number"name="serviceQuantity" placeholder="Enter Quantity" value={formData.serviceQuantity} onChange={handleChange} min="0" step ="1" className={inputStyle} required/>
                        </div>

                        <div>
                            <label className={labelStyle}>
                                Service Image URL
                            </label>
                            <input
                            type="url"
                            name="serviceImageUrl"
                            placeholder="https://example.com/image.jpg"
                            value={formData.serviceImageUrl}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <p className="mt-1.5 text-xs text-gray-500">
                            Enter a URL for your product image.
                        </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.99]"
                        >
                            Register Service
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )


}