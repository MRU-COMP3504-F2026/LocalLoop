import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/utils";

export type OwnerBusiness = {
  business_id: string;
  owner_id: string;
  name: string;
  description: string | null;
  category: string | null;
  location: string | null;
};

type BusinessRow = OwnerBusiness;

async function findBusinessByOwnerId(ownerId: string): Promise<BusinessRow | null> {
  const { data, error } = await supabase
    .from("Businesses")
    .select("business_id, owner_id, name, description, category, location")
    .eq("owner_id", ownerId)
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
}

type SessionResult = Awaited<ReturnType<typeof supabase.auth.getSession>>;

function withTimeout(promise: Promise<SessionResult>, ms: number): Promise<SessionResult> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve({ data: { session: null }, error: null });
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function getCurrentUser(): Promise<User | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  ) {
    throw new Error("supabase is not configured");
  }

  const { data, error } = await withTimeout(supabase.auth.getSession(), 2500);

  if (error) {
    if (
      error.name === "AuthSessionMissingError" ||
      /session missing/i.test(error.message)
    ) {
      return null;
    }
    throw error;
  }

  return data.session?.user ?? null;
}

export const SAMPLE_BUSINESS: OwnerBusiness = {
  business_id: "demo",
  owner_id: "demo",
  name: "Moss & Clay Studio",
  description:
    "Small-batch ceramics. Handmade by Maya Chen in Kensington. Shop ceramics in-person or join us for a pottery session in the pottery garden.",
  category: "Ceramics",
  location: "1124 Kensington Road NW, Calgary",
};

export async function getDashboardBusiness(): Promise<OwnerBusiness | null> {
  try {
    const { data, error } = await supabase
      .from("Businesses")
      .select("business_id, owner_id, name, description, category, location")
      .limit(1);

    if (error || !data?.[0]) {
      return null;
    }

    return data[0];
  } catch {
    return null;
  }
}

export async function getBusinessForOwner(
  userId: string,
  email?: string | null,
): Promise<OwnerBusiness | null> {
  const ownedByAuthId = await findBusinessByOwnerId(userId);
  if (ownedByAuthId) {
    return ownedByAuthId;
  }

  if (!email) {
    return null;
  }

  const { data: users, error: userError } = await supabase
    .from("User")
    .select("user_id")
    .eq("email", email)
    .limit(1);

  if (userError) {
    throw userError;
  }

  const profileId = users?.[0]?.user_id as string | undefined;
  if (!profileId) {
    return null;
  }

  return findBusinessByOwnerId(profileId);
}
