"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useProduct } from "@/context/productContext";

export default function ProductRegistrationForm() {
    const { productData, setProductData } = useProduct();

    const [formData, setFormData] = useState({
        productName: productData.productName,
        productType: productData.productType,
        productDescription: productData.productDescription,
        productPrice: productData.productPrice,
        productQuantity: productData.productQuantity,
        productImageUrl: productData.productImageUrl
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
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
        setProductData(formData);
        console.log("Product registered:", formData);
    };

    const inputStyle =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const labelStyle =
        "mb-2 block text-sm font-medium text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Register a Product
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your product information below.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    {/* Product Name */}
                    <div>
                        <label className={labelStyle}>
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="productName"
                            placeholder="Enter product name"
                            value={formData.productName}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />
                    </div>

                    {/* Product Type */}
                    <div>
                        <label className={labelStyle}>
                            Product Type
                        </label>
                        <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        >
                            <option value="">Select Product Type</option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelStyle}>
                            Product Description
                        </label>
                        <textarea
                            name="productDescription"
                            placeholder="Describe your product..."
                            value={formData.productDescription}
                            onChange={handleChange}
                            rows={4}
                            className={inputStyle + " resize-none"}
                            required
                        />
                    </div>

                    {/* Price and Quantity */}
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
                        <p className="mt-1.5 text-xs text-gray-500">
                            Enter a URL for your product image.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.99]"
                        >
                            Register Product
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}


