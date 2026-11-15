import { accountTypesForEmail, clearBusinessId } from "@/lib/database";
import { supabase } from "@/lib/utils";

export type AuthResult = {
  userId: string;
  needsConfirmation: boolean;
};

const ALREADY_REGISTERED = "An account already exists. Sign in instead.";

export async function signUpAccount(input: {
  name: string;
  email: string;
  password: string;
  accountType: "business" | "client";
}): Promise<AuthResult> {
  const existingTypes = await accountTypesForEmail(input.email);
  if (existingTypes.includes(input.accountType)) {
    throw new Error(ALREADY_REGISTERED);
  }

  const auth = existingTypes.length > 0
    ? await signInExisting(
        input.email,
        input.password,
        "Use the password from your existing account to add this one.",
      )
    : await createAuthUser(input);

  const userId = existingTypes.length === 0 ? auth.userId : `${auth.userId}:${input.accountType}`;
  const { error: profileError } = await supabase.from("User").insert({
    user_id: userId,
    name: input.name,
    email: input.email,
    phone_number: "",
    account_type: input.accountType,
  });

  if (profileError) {
    if (/duplicate|unique/i.test(profileError.message)) throw new Error(ALREADY_REGISTERED);
    throw profileError;
  }

  return auth;
}

async function createAuthUser(input: {
  name: string;
  email: string;
  password: string;
  accountType: "business" | "client";
}): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: { name: input.name, account_type: input.accountType },
    },
  });

  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      return signInExisting(input.email, input.password);
    }
    throw error;
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return signInExisting(input.email, input.password);
  }

  const userId = data.user?.id;
  if (!userId) throw new Error("Account was not created.");
  return { userId, needsConfirmation: !data.session };
}

async function signInExisting(
  email: string,
  password: string,
  failureMessage = ALREADY_REGISTERED,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(failureMessage);
  return { userId: data.user.id, needsConfirmation: !data.session };
}

export async function signInAccount(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOutAccount() {
  clearBusinessId();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
