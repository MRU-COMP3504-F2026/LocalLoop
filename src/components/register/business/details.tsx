
"use client";

import CategorySelect from "./categorySelect";
import OpeningHours from "./openingHours";
import ImageUpload from "./imageUpload";
import { useBusiness } from "@/context/accounts/businessContext";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const fieldClass = "h-11 rounded-2xl bg-loop-cream px-4";

const BusinessDetails = ({ section }: { section: "shop" | "extra" }) => {
    const { businessData, setBusinessData } = useBusiness();

    if (section === "extra") {
        return (
            <FieldGroup className="grid gap-6 md:grid-cols-2">
                <Field>
                    <FieldLabel>Categories (Select up to 3)</FieldLabel>
                    <CategorySelect
                        selectedCategories={businessData.category}
                        onChange={(categories) =>
                            setBusinessData({
                                ...businessData,
                                category: categories,
                            })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Business Photos</FieldLabel>
                    <ImageUpload
                        images={businessData.images}
                        onChange={(images) =>
                            setBusinessData({
                                ...businessData,
                                images: images,
                            })
                        }
                    />
                </Field>

                <Field className="md:col-span-2">
                    <FieldLabel>Business Hours</FieldLabel>
                    <OpeningHours
                        hours={businessData.openingHours}
                        onChange={(hours) =>
                            setBusinessData({
                                ...businessData,
                                openingHours: hours,
                            })
                        }
                    />
                </Field>
            </FieldGroup>
        );
    }

    return (
        <FieldGroup className="space-y-4">
            <Field>
                <FieldLabel htmlFor="location">Location*</FieldLabel>
                <Input
                    id="location"
                    value={businessData.location}
                    onChange={(e) =>
                        setBusinessData({
                            ...businessData,
                            location: e.target.value,
                        })
                    }
                    className={fieldClass}
                    required
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                    id="description"
                    placeholder="Tell us about your business"
                    rows={4}
                    value={businessData.description}
                    onChange={(e) =>
                        setBusinessData({
                            ...businessData,
                            description: e.target.value,
                        })
                    }
                    className="min-h-28 rounded-2xl bg-loop-cream px-4"
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="onlineStore">
                    Existing Online Store
                </FieldLabel>
                <Input
                    id="onlineStore"
                    value={businessData.onlineStore}
                    type="url"
                    onChange={(e) =>
                        setBusinessData({
                            ...businessData,
                            onlineStore: e.target.value,
                        })
                    }
                    className={fieldClass}
                />
            </Field>
        </FieldGroup>
    );
};

export default BusinessDetails;