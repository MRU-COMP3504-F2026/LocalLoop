"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CategorySelectProps = {
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
};

const categories = [
    "Food & Beverage",
    "Clothing",
    "Ceramics",
    "Handmade",
    "Jewelry",
    "Electronics",
    "Services",
    "Other",
];

const CategorySelect = (props: CategorySelectProps) => {

    const toggleCategory = (category: string) => {

        if (props.selectedCategories.includes(category)) {
            props.onChange(
                props.selectedCategories.filter((item) => item !== category)
            );
        }

        else if (props.selectedCategories.length < 3) {
            props.onChange([...props.selectedCategories, category]);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        type="button"
                        size="sm"
                        variant={
                            props.selectedCategories.includes(category)
                                ? "default"
                                : "outline"
                        }
                        onClick={() => toggleCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Selected categories ({props.selectedCategories.length}/3)
                </p>

                <div className="flex flex-wrap gap-2">
                    {props.selectedCategories.map((category) => (
                        <Badge key={category} variant="secondary">
                            {category}
                            <button
                                type="button"
                                className="ml-2"
                                onClick={() => toggleCategory(category)}
                                aria-label={`Remove ${category}`}
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CategorySelect;