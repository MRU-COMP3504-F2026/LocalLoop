"use client";
import ImageUpload from "./imageUpload";
import CategorySelect from "./categorySelect";
import OpeningHours from "./openingHours";
import { useBusiness } from "@/context/businessContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const RegisterForm = () => {
  const { businessData, setBusinessData } = useBusiness();
  const router = useRouter();

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Business Information:", businessData);

    router.push("/display");
};

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Put your roots on the map</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            A little about your business page goes a long way. Help your neighbours find you.
          </div>

          <form id="register-form" onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="businessName">Business Name*</FieldLabel>
                <Input
                  id="businessName"
                  value={businessData.businessName}
                  onChange={(e) =>
                  setBusinessData({
                      ...businessData,
                      businessName: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Business email*</FieldLabel>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessData.email}
                  onChange={(e) =>
                  setBusinessData({
                      ...businessData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password*</FieldLabel>
                <Input
                  id="password"
                  value={businessData.password}
                  type="password"
                  onChange={(e) =>
                  setBusinessData({
                      ...businessData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password*</FieldLabel>
                <Input
                  id="comfimPassword"
                  type="password"
                  value={businessData.confirmPass}
                  onChange={(e) =>
                  setBusinessData({
                      ...businessData,
                      confirmPass: e.target.value,
                    })
                  }
                  required
                />
              </Field>
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
                />
              </Field>
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
              <Field>
                <FieldLabel htmlFor="onlineStore">Existing Online Store</FieldLabel>
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
                  required
                />
              </Field>
              <Field>
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
          </form>
        </CardContent>

        <CardFooter>
          <Button form="register-form" type="submit" className="w-full">
            Create Business Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export {RegisterForm};
