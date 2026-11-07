
"use client";

import { createContext, useContext, useState } from "react";

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
    setAccountData: React.Dispatch<React.SetStateAction<AccountData>>;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = (props: { children: React.ReactNode }) => {
    const [accountData, setAccountData] = useState<AccountData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "business",
    });

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
