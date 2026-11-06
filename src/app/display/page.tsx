
"use client";

import { useBusiness } from "@/context/businessContext";

const DisplayPage = () => {

    const { businessData } = useBusiness();

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">
                Your Business Profile
            </h1>

            <div className="mt-6 space-y-3">

                <p>
                    <strong>Business Name:</strong>{" "}
                    {businessData.businessName}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {businessData.email}
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

                <p>
                    <strong>Opening Hours:</strong>{" "}
                    {businessData.openingHours}
                </p>

            </div>
        </div>
    );
};

export default DisplayPage;
