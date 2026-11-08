"use client";
import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
export type AccountType = "business" | "client";

type AccountData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: AccountType;
};

type AccountContextType = {
    accountData: AccountData;
    setAccountData: Dispatch<SetStateAction<AccountData>>;
};

type AccountProviderProps = {
    children: ReactNode;
};
const initialAccountData: AccountData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "business",
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = (props: AccountProviderProps) => {
    const [accountData, setAccountData] = useState<AccountData>(initialAccountData);

    return (
        <AccountContext.Provider value={{ accountData, setAccountData }}>
            {props.children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useAccount must be used inside AccountProvider");
    }

    return context;
};
