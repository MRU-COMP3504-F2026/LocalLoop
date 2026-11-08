"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  location: string;
  imageSrc: string;
};

export default function BusinessSummaryCard({
  name,
  location,
  imageSrc,
}: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageSrc]);

  const showImage = Boolean(imageSrc) && !failed;

  return (
    <div className="flex items-center gap-3 px-5 pt-8">
      {showImage ? (
        <img
          src={imageSrc}
          alt=""
          className="h-[52px] w-[52px] rounded-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="h-[52px] w-[52px] rounded-full bg-loop-sage" />
      )}
      <div>
        <p className="font-serif text-2xl text-loop-green-dark">{name}</p>
        <p className="text-xs text-loop-green">{location}</p>
      </div>
    </div>
  );
}