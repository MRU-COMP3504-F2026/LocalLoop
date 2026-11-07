
"use client";

import { useBusiness } from "@/context/accounts/businessContext";
import { useAccount } from "@/context/accounts/accountContext";

const DisplayPage = () => {

    const { businessData } = useBusiness();
    const { accountData } = useAccount();

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const date = new Date();

        date.setHours(Number(hours), Number(minutes));

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
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
                        {Object.entries(businessData.openingHours).map(([day, schedule]) => (
                            <p key={day}>
                                <strong>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}:
                                </strong>{" "}
                                {schedule.closed
                                    ? "Closed"
                                    : `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`}
                            </p>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DisplayPage;
