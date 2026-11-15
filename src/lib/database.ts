import type { OfferingDetail } from "@/lib/offering";
import type { OwnerBusiness } from "@/lib/ownerBusiness";
import { supabase } from "@/lib/utils";

export type SavedProduct = {
  productId?: string;
  productName: string;
  productType: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  images: File[];
  details: OfferingDetail[];
  imageUrl?: string;
  persisted?: boolean;
};

const BUSINESS_KEY = "localloop-business-id";

export type BusinessRecord = OwnerBusiness & {
  email: string | null;
  phone_number: string | null;
  address: string | null;
};

export type ProductRecord = {
  product_id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number | null;
  quantity: number | null;
  image_url: string | null;
};

const businessColumns =
  "business_id, owner_id, name, description, category, email, phone_number, address, location";

export function readBusinessId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BUSINESS_KEY);
}

export function writeBusinessId(businessId: string) {
  window.localStorage.setItem(BUSINESS_KEY, businessId);
}

export function clearBusinessId() {
  window.localStorage.removeItem(BUSINESS_KEY);
}

export async function listBusinesses(): Promise<BusinessRecord[]> {
  const { data, error } = await supabase
    .from("Businesses")
    .select(businessColumns)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getBusiness(businessId: string): Promise<BusinessRecord | null> {
  const { data, error } = await supabase
    .from("Businesses")
    .select(businessColumns)
    .eq("business_id", businessId)
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function createBusiness(input: {
  name: string;
  email: string;
  description: string;
  category: string;
  location: string;
}): Promise<BusinessRecord> {
  const ownerId = crypto.randomUUID();
  const { data: user, error: userError } = await supabase
    .from("User")
    .insert({
      user_id: ownerId,
      name: input.name,
      email: input.email,
      phone_number: "",
      account_type: "business",
    })
    .select("user_id")
    .single();

  if (userError) throw userError;

  const { data, error } = await supabase
    .from("Businesses")
    .insert({
      owner_id: user.user_id,
      name: input.name,
      description: input.description,
      category: input.category,
      email: input.email,
      phone_number: "",
      address: input.location,
      location: input.location,
    })
    .select(businessColumns)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBusiness(
  businessId: string,
  input: {
    name: string;
    email: string;
    description: string;
    category: string;
    location: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("Businesses")
    .update({
      name: input.name,
      description: input.description,
      category: input.category,
      email: input.email,
      address: input.location,
      location: input.location,
    })
    .eq("business_id", businessId);

  if (error) throw error;

  const current = await getBusiness(businessId);
  if (!current?.owner_id) return;

  const { error: userError } = await supabase
    .from("User")
    .update({ name: input.name, email: input.email })
    .eq("user_id", current.owner_id);

  if (userError) throw userError;
}

export function toProductData(row: ProductRecord): SavedProduct {
  return {
    productId: row.product_id,
    productName: row.name,
    productType: "",
    productDescription: row.description ?? "",
    productPrice: Number(row.price ?? 0),
    productQuantity: Number(row.quantity ?? 0),
    images: [],
    details: [],
    imageUrl: row.image_url ?? "",
    persisted: true,
  };
}

export async function listProducts(businessId: string): Promise<SavedProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("product_id, business_id, name, description, price, quantity, image_url")
    .eq("business_id", businessId);

  if (error) throw error;
  return (data ?? []).map((row) => toProductData(row as ProductRecord));
}

export async function insertProduct(businessId: string, product: SavedProduct): Promise<SavedProduct> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      business_id: businessId,
      name: product.productName,
      description: product.productDescription,
      price: product.productPrice,
      quantity: product.productQuantity,
      image_url: product.imageUrl ?? "",
    })
    .select("product_id, business_id, name, description, price, quantity, image_url")
    .single();

  if (error) throw error;
  return toProductData(data as ProductRecord);
}

export async function updateProductRow(product: SavedProduct): Promise<void> {
  if (!product.productId) return;

  const { error } = await supabase
    .from("products")
    .update({
      name: product.productName,
      description: product.productDescription,
      price: product.productPrice,
      quantity: product.productQuantity,
      image_url: product.imageUrl ?? "",
    })
    .eq("product_id", product.productId);

  if (error) throw error;
}

export async function deleteProductRow(productId: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("product_id", productId);
  if (error) throw error;
}
