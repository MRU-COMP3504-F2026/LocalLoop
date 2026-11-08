"use client";

import type { SubmitEventHandler } from "react";

import AccountForm from "./accountForm";
import BusinessDetails from "./business/details";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const RegisterForm = () => {
    const router = useRouter();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        router.push("/publishing");
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
            <header>
                <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
                <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">put your roots on the map</h1>
                <p className="mt-3 max-w-md text-loop-green md:text-lg">
                    A little about your business page goes a long way. Help your neighbours find you.
                </p>
            </header>

            <form id="register-form" onSubmit={handleSubmit} className="mt-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <section className="rounded-[28px] bg-white p-5 md:p-7">
                        <h2 className="font-serif text-xl md:text-2xl">account</h2>
                        <div className="mt-4">
                            <AccountForm accountType="business" />
                        </div>
                    </section>

                    <section className="rounded-[28px] bg-white p-5 md:p-7">
                        <h2 className="font-serif text-xl md:text-2xl">the shop</h2>
                        <div className="mt-4">
                            <BusinessDetails section="shop" />
                        </div>
                    </section>
                </div>

                <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
                    <h2 className="font-serif text-xl md:text-2xl">details</h2>
                    <div className="mt-4">
                        <BusinessDetails section="extra" />
                    </div>
                </section>

                <Button
                    type="submit"
                    className="mt-8 h-auto w-full rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white hover:bg-loop-green md:w-auto md:px-8"
                >
                    Create Business Profile
                </Button>
            </form>
        </div>
    );
};

export { RegisterForm };
