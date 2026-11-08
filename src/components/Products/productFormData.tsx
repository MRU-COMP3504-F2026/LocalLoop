"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useProduct } from "@/context/productContext";

export default function ProductRegistrationForm() {
    const { productData, addProduct } = useProduct();

    const [formData, setFormData] = useState({
        productName: productData.productName,
        productType: productData.productType,
        productDescription: productData.productDescription,
        productPrice: productData.productPrice,
        productQuantity: productData.productQuantity,
        productImageUrl: productData.productImageUrl
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "productPrice" || name === "productQuantity"
                    ? Number(value)
                    : value
        });
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        addProduct(formData);
        console.log("Product registered:", formData);
    };

    const inputStyle = "w-full rounded-2xl border border-loop-border bg-white px-4 py-2.5 text-loop-green-dark outline-none transition focus:border-loop-green focus:ring-2 focus:ring-loop-sage";

    const labelStyle = "mb-2 block text-sm font-semibold text-loop-green-dark";

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
            <header>
                <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
                <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">register a product</h1>
                <p className="mt-3 max-w-md text-loop-green md:text-lg">Enter your product information below.</p>
            </header>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="space-y-6 rounded-[28px] bg-white p-5 md:p-7">
                    <div>
                        <label className={labelStyle}>
                            Product Name
                        </label>
                        <input type="text" name="productName" placeholder="Enter product name" value={formData.productName} onChange={handleChange} className={inputStyle} required/>
                    </div>

                    <div>
                        <label className={labelStyle}>
                            Product Type
                        </label>
                        <select name="productType" value={formData.productType} onChange={handleChange} className={inputStyle} required>
                            <option value="">Select Product Type</option>
                            <option value="Baked goods">Baked goods</option>
                            <option value="Prepared food">Prepared food</option>
                            <option value="Drink">Drink</option>
                            <option value="Goods">Goods</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelStyle}>
                            Product Description
                        </label>
                        <textarea name="productDescription" placeholder="Describe your product..." value={formData.productDescription} onChange={handleChange} rows={4} className={inputStyle + " resize-none"} required />
                    </div>
                </div>

                <div className="flex flex-col gap-6 rounded-[28px] bg-white p-5 md:p-7">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <label className={labelStyle}>
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="productPrice"
                                placeholder="0.00"
                                value={formData.productPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="productQuantity"
                                placeholder="Enter quantity"
                                value={formData.productQuantity}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                className={inputStyle}
                                required
                            />
                        </div>

                    </div>

                    {/* Image URL */}
                    <div>
                        <label className={labelStyle}>
                            Product Image URL
                        </label>
                        <input
                            type="url"
                            name="productImageUrl"
                            placeholder="https://example.com/image.jpg"
                            value={formData.productImageUrl}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <p className="mt-1.5 text-xs text-loop-green">
                            Enter a URL for your product image.
                        </p>
                    </div>

                    <div className="mt-auto border-t border-loop-border pt-5">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white hover:bg-loop-green md:w-auto md:px-8"
                        >
                            Register Product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}


