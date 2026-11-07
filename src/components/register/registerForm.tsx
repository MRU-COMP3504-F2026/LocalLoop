
"use client";

import AccountForm from "./accountForm";
import BusinessDetails from "./business/details";

import { useAccount } from "@/context/accounts/accountContext";
import { useRouter } from "next/navigation";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

const RegisterForm = () => {
    const { accountData } = useAccount();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Account Information:", accountData);

        router.push("/display");
    };

    return (
        <div className="flex justify-center mt-20">
            <Card className="w-[350px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">
                        Put your roots on the map
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="mb-4 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                        A little about your business page goes a long way.
                        Help your neighbours find you.
                    </div>

                    <form id="register-form" onSubmit={handleSubmit}>
                        <FieldGroup className="space-y-4">
                            <AccountForm accountType="business" />

                            <BusinessDetails />
                        </FieldGroup>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button
                        form="register-form"
                        type="submit"
                        className="w-full"
                    >
                        Create Business Profile
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export { RegisterForm };