"use client";

import { useAccount, type AccountType } from "@/context/accounts/accountContext";

import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface AccountFormProps {
    accountType: AccountType;
}
const AccountForm = (props: AccountFormProps) => {
    const { accountData, setAccountData } = useAccount();

    const usernameLabel = props.accountType === "business"
        ? "Business Name"
        : "Username";

    return (
        <FieldGroup className="space-y-4">
            <Field>
                <FieldLabel htmlFor="username">{usernameLabel}*</FieldLabel>
                <Input
                    id="username"
                    value={accountData.username}
                    onChange={(e) =>
                        setAccountData((prev) => ({
                        ...prev,
                        username: e.target.value,
                        }))
                    }
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="email">Email*</FieldLabel>
                <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) =>
                        setAccountData({
                            ...accountData,
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
                    type="password"
                    value={accountData.password}
                    onChange={(e) =>
                        setAccountData({
                            ...accountData,
                            password: e.target.value,
                        })
                    }
                    required
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="confirmPassword">
                    Confirm Password*
                </FieldLabel>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={(e) =>
                        setAccountData({
                            ...accountData,
                            confirmPassword: e.target.value,
                        })
                    }
                    required
                />
            </Field>
        </FieldGroup>
    );
};

export default AccountForm;
