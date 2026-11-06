"use client";

import { BusinessHours } from "@/context/businessContext";

type OpeningHoursProps = {
    hours: BusinessHours;
    onChange: (hours: BusinessHours) => void;
};

const OpeningHours = (props: OpeningHoursProps) => {

    const days: { key: keyof BusinessHours; label: string }[] = [
        { key: "monday", label: "Monday" },
        { key: "tuesday", label: "Tuesday" },
        { key: "wednesday", label: "Wednesday" },
        { key: "thursday", label: "Thursday" },
        { key: "friday", label: "Friday" },
        { key: "saturday", label: "Saturday" },
        { key: "sunday", label: "Sunday" },
    ];

    const updateTime = (
        day: keyof BusinessHours,
        field: "open" | "close",
        value: string
    ) => {
        props.onChange({
            ...props.hours,
            [day]: {
                ...props.hours[day],
                [field]: value,
            },
        });
    };

    const toggleClosed = (day: keyof BusinessHours, closed: boolean) => {
        props.onChange({
            ...props.hours,
            [day]: {
                ...props.hours[day],
                closed: closed,
            },
        });
    };

    return (
        <div className="space-y-4">
            {days.map((day) => (
                <div
                    key={day.key}
                    className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center"
                >
                    <div className="w-28 font-medium">
                        {day.label}
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={props.hours[day.key].closed}
                            onChange={(e) =>
                                toggleClosed(day.key, e.target.checked)
                            }
                        />
                        <span className="text-sm">Closed</span>
                    </label>

                    {!props.hours[day.key].closed && (
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="time"
                                value={props.hours[day.key].open}
                                onChange={(e) =>
                                    updateTime(day.key, "open", e.target.value)
                                }
                                className="border rounded-md p-2"
                            />

                            <span>to</span>

                            <input
                                type="time"
                                value={props.hours[day.key].close}
                                onChange={(e) =>
                                    updateTime(day.key, "close", e.target.value)
                                }
                                className="border rounded-md p-2"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OpeningHours;
