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
    const inputStyle = "w-full rounded-2xl border border-loop-border bg-white px-4 py-2.5 text-loop-green-dark outline-none transition focus:border-loop-green focus:ring-2 focus:ring-loop-sage";
    const labelStyle = "mb-2 block text-sm font-semibold text-loop-green-dark";

    return(
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
            <header>
                <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
                <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">register a service</h1>
                <p className="mt-3 max-w-md text-loop-green md:text-lg">Enter your service information below.</p>
            </header>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="space-y-6 rounded-[28px] bg-white p-5 md:p-7">
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
                </div>

                <div className="flex flex-col gap-6 rounded-[28px] bg-white p-5 md:p-7">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelStyle}>
                                Price ($)
                            </label>
                            <input type="number" name="servicePrice" placeholder="0.00" value={formData.servicePrice} onChange={handleChange} min="0" step="0.01" className={inputStyle} required/>
                        </div>

                        <div>
                            <label className={labelStyle}>
                                Quantity
                            </label>
                            <input type="number" name="serviceQuantity" placeholder="Enter Quantity" value={formData.serviceQuantity} onChange={handleChange} min="0" step="1" className={inputStyle} required/>
                        </div>
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
                        <p className="mt-1.5 text-xs text-loop-green">
                            Enter a URL for your service image.
                        </p>
                    </div>
                    <div className="mt-auto border-t border-loop-border pt-5">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white hover:bg-loop-green md:w-auto md:px-8"
                        >
                            Register Service
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )


}