
"use client";

import { useBusiness } from "@/context/accounts/businessContext";
import { useAccount } from "@/context/accounts/accountContext";
import { useEffect, useState } from "react";
import Image from "next/image";

const DisplayPage = () => {
    const { businessData } = useBusiness();
    const { accountData } = useAccount();

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const urls = businessData.images.map((image) =>
            URL.createObjectURL(image)
        );

        setImageUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [businessData.images]);

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">
                Your Business Profile
            </h1>

            <div className="mt-6 space-y-3">

                <p>
                    <strong>Business Name:</strong>{" "}
                    {accountData.username}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {accountData.email}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {businessData.location}
                </p>

                <p>
                    <strong>Description:</strong>{" "}
                    {businessData.description}
                </p>

                <p>
                    <strong>Categories:</strong>{" "}
                    {businessData.category.join(", ")}
                </p>

                <p>
                    <strong>Online Store:</strong>{" "}
                    {businessData.onlineStore}
                </p>

                <div>
                    <strong>Opening Hours:</strong>

                    <div className="mt-2 space-y-1">
                        {Object.entries(businessData.openingHours).map(
                            ([day, schedule]) => (
                                <p key={day}>
                                    <strong>
                                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                                    </strong>{" "}
                                    {schedule.closed
                                        ? "Closed"
                                        : `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`}
                                </p>
                            )
                        )}
                    </div>
                </div>

                <div>
                    <strong>Business Images:</strong>

                    {imageUrls.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-4">
                            {imageUrls.map((url, index) => (
                                <Image
                                    key={index}
                                    src={url}
                                    alt={`Business image ${index + 1}`}
                                    width={200}
                                    height={200}
                                    unoptimized
                                    className="rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2">
                            No business images uploaded.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DisplayPage;
