"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness } from "@/context/accounts/businessContext";

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default function ProfilePage() {
  const { businessData } = useBusiness();
  const { accountData } = useAccount();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = businessData.images.map((image) => URL.createObjectURL(image));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [businessData.images]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
        <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">
          your business profile
        </h1>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-[28px] bg-white p-5 md:p-7">
          <p>
            <strong>Business Name:</strong> {accountData.username}
          </p>
          <p>
            <strong>Email:</strong> {accountData.email}
          </p>
          <p>
            <strong>Location:</strong> {businessData.location}
          </p>
          <p>
            <strong>Description:</strong> {businessData.description}
          </p>
          <p>
            <strong>Categories:</strong> {businessData.category.join(", ")}
          </p>
          <p>
            <strong>Online Store:</strong> {businessData.onlineStore}
          </p>
        </div>

        <div className="space-y-6 rounded-[28px] bg-white p-5 md:p-7">
          <div>
            <strong>Opening Hours:</strong>
            <div className="mt-2 space-y-1">
              {Object.entries(businessData.openingHours).map(([day, schedule]) => (
                <p key={day}>
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                  {schedule.closed
                    ? "Closed"
                    : `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`}
                </p>
              ))}
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
              <p className="mt-2 text-loop-green">No business images uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
