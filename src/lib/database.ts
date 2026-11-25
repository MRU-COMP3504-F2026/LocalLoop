import type { BusinessHours } from "@/context/accounts/businessContext";
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

export type SavedService = {
  serviceId?: string;
  serviceName: string;
  serviceType: string;
  serviceDescription: string;
  servicePrice: number;
  serviceQuantity: number;
  images: File[];
  details: OfferingDetail[];
  imageUrl?: string;
  persisted?: boolean;
};

const BUSINESS_KEY = "localloop-business-id";
const PHOTO_BUCKET = "business-photos";

export type BusinessRecord = OwnerBusiness & {
  email: string | null;
  phone_number: string | null;
  address: string | null;
  online_store: string | null;
  opening_hours: Record<string, unknown> | null;
};

type ProductRow = {
  product_id: string | number;
  business_id: string | number;
  name: string;
  description: string | null;
  price: number | string | null;
  quantity: number | string | null;
  image_url: string | null;
  type?: string | null;
  details?: OfferingDetail[] | null;
};

type ServiceRow = {
  service_id: string | number;
  business_id: string | number;
  name: string;
  description: string | null;
  type: string | null;
  price: number | string | null;
  quantity: number | string | null;
  image_url: string | null;
  details?: OfferingDetail[] | null;
};

const businessColumns =
  "business_id, owner_id, name, description, category, email, phone_number, address, location, online_store, opening_hours";

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function databaseReady() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes("example.supabase.co"));
}

function asBusiness(row: BusinessRecord): BusinessRecord {
  return {
    ...row,
    business_id: String(row.business_id),
    owner_id: String(row.owner_id),
  };
}

function readDetails(value: unknown): OfferingDetail[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const detail = item as { label?: unknown; value?: unknown };
    if (typeof detail.label !== "string" || typeof detail.value !== "string") return [];
    return [{ label: detail.label, value: detail.value }];
  });
}

export function readHours(value: Record<string, unknown> | null): BusinessHours | null {
  if (!value || typeof value.monday !== "object" || value.monday === null) return null;
  const hours = {} as BusinessHours;
  for (const day of DAY_KEYS) {
    const schedule = value[day];
    if (!schedule || typeof schedule !== "object") return null;
    const entry = schedule as { open?: unknown; close?: unknown; closed?: unknown };
    hours[day] = {
      open: typeof entry.open === "string" ? entry.open : "09:00",
      close: typeof entry.close === "string" ? entry.close : "17:00",
      closed: Boolean(entry.closed),
    };
  }
  return hours;
}

export function readImageUrls(value: Record<string, unknown> | null): string[] {
  if (!value || !Array.isArray(value.image_urls)) return [];
  return value.image_urls.filter((url): url is string => typeof url === "string" && url.length > 0);
}

export function readShowEmail(value: Record<string, unknown> | null): boolean {
  return value?.show_email === true;
}

function hoursPayload(hours: BusinessHours, imageUrls: string[], showEmail = false) {
  return { ...hours, image_urls: imageUrls, show_email: showEmail };
}

export async function accountTypesForEmail(email: string): Promise<string[]> {
  const { data, error } = await supabase.from("User").select("account_type").ilike("email", email);
  if (error) throw error;
  return (data ?? [])
    .map((row) => row.account_type)
    .filter((type): type is string => typeof type === "string" && type.length > 0);
}

export async function setShowEmail(businessId: string, showEmail: boolean): Promise<void> {
  const current = await getBusiness(businessId);
  const openingHours = {
    ...(current?.opening_hours ?? {}),
    show_email: showEmail,
  };
  const { error } = await supabase
    .from("Businesses")
    .update({ opening_hours: openingHours })
    .eq("business_id", businessId);
  if (error) throw error;
}

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

export async function uploadPhotos(folder: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.]+/g, "-");
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file);
    if (error) {
      if (/bucket not found/i.test(error.message)) {
        throw new Error("make a public bucket named business-photos, then try the photo again");
      }
      throw error;
    }
    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function listBusinesses(): Promise<BusinessRecord[]> {
  const { data, error } = await supabase.from("Businesses").select(businessColumns).order("name");
  if (error) throw error;
  return (data ?? []).map((row) => asBusiness(row as BusinessRecord));
}

export async function getBusiness(businessId: string): Promise<BusinessRecord | null> {
  const { data, error } = await supabase
    .from("Businesses")
    .select(businessColumns)
    .eq("business_id", businessId)
    .limit(1);

  if (error) throw error;
  return data?.[0] ? asBusiness(data[0] as BusinessRecord) : null;
}

export async function getBusinessByEmail(email: string): Promise<BusinessRecord | null> {
  const { data, error } = await supabase
    .from("Businesses")
    .select(businessColumns)
    .eq("email", email)
    .limit(1);

  if (error) throw error;
  return data?.[0] ? asBusiness(data[0] as BusinessRecord) : null;
}

export async function loadSessionBusiness(): Promise<BusinessRecord | null> {
  if (!databaseReady()) return null;

  const { data } = await supabase.auth.getSession();
  const email = data.session?.user.email;
  if (email) {
    const owned = await getBusinessByEmail(email);
    if (owned) {
      writeBusinessId(owned.business_id);
      return owned;
    }
  }

  const storedId = readBusinessId();
  if (!storedId) return null;
  return getBusiness(storedId);
}

export async function createBusiness(input: {
  name: string;
  email: string;
  description: string;
  category: string;
  location: string;
  onlineStore: string;
  hours: BusinessHours;
  images: File[];
}): Promise<BusinessRecord> {
  const ownerId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
  const { data, error } = await supabase
    .from("Businesses")
    .insert({
      owner_id: ownerId,
      name: input.name,
      description: input.description,
      category: input.category,
      email: input.email,
      phone_number: "",
      address: input.location,
      location: input.location,
      online_store: input.onlineStore,
      opening_hours: hoursPayload(input.hours, []),
    })
    .select(businessColumns)
    .single();

  if (error) throw error;
  const business = asBusiness(data as BusinessRecord);

  if (input.images.length === 0) return business;

  const imageUrls = await uploadPhotos(business.business_id, input.images);
  const { error: photoError } = await supabase
    .from("Businesses")
    .update({ opening_hours: hoursPayload(input.hours, imageUrls) })
    .eq("business_id", business.business_id);

  if (photoError) throw photoError;
  return { ...business, opening_hours: hoursPayload(input.hours, imageUrls) };
}

export async function updateBusiness(
  businessId: string,
  input: {
    name: string;
    email: string;
    description: string;
    category: string;
    location: string;
    onlineStore: string;
    hours: BusinessHours;
    imageUrls: string[];
  },
): Promise<void> {
  const current = await getBusiness(businessId);
  const { error } = await supabase
    .from("Businesses")
    .update({
      name: input.name,
      description: input.description,
      category: input.category,
      email: input.email,
      address: input.location,
      location: input.location,
      online_store: input.onlineStore,
      opening_hours: hoursPayload(input.hours, input.imageUrls, readShowEmail(current?.opening_hours ?? null)),
    })
    .eq("business_id", businessId);

  if (error) throw error;

  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;

  const { error: userError } = await supabase
    .from("User")
    .update({ name: input.name, email: input.email })
    .eq("user_id", userId);

  if (userError) throw userError;
}

function toProductData(row: ProductRow): SavedProduct {
  const imageUrl = row.image_url ?? "";
  return {
    productId: String(row.product_id),
    productName: row.name,
    productType: row.type ?? "",
    productDescription: row.description ?? "",
    productPrice: Number(row.price ?? 0),
    productQuantity: Number(row.quantity ?? 0),
    images: [],
    details: readDetails(row.details),
    imageUrl,
    persisted: true,
  };
}

function toServiceData(row: ServiceRow): SavedService {
  return {
    serviceId: String(row.service_id),
    serviceName: row.name,
    serviceType: row.type ?? "",
    serviceDescription: row.description ?? "",
    servicePrice: Number(row.price ?? 0),
    serviceQuantity: Number(row.quantity ?? 0),
    images: [],
    details: readDetails(row.details),
    imageUrl: row.image_url ?? "",
    persisted: true,
  };
}

export async function listProducts(businessId: string): Promise<SavedProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("product_id, business_id, name, description, price, quantity, image_url, type, details")
    .eq("business_id", businessId);

  if (error) throw error;
  return (data ?? []).map((row) => toProductData(row as ProductRow));
}

export async function insertProduct(businessId: string, product: SavedProduct): Promise<SavedProduct> {
  const uploaded = product.images.length ? await uploadPhotos(`${businessId}/products`, product.images) : [];
  const imageUrl = uploaded[0] ?? product.imageUrl ?? "";
  const { data, error } = await supabase
    .from("products")
    .insert({
      product_id: product.productId ?? crypto.randomUUID(),
      business_id: businessId,
      name: product.productName,
      description: product.productDescription,
      price: product.productPrice,
      quantity: product.productQuantity,
      image_url: imageUrl,
      type: product.productType,
      details: product.details,
    })
    .select("product_id, business_id, name, description, price, quantity, image_url, type, details")
    .single();

  if (error) throw error;
  return { ...toProductData(data as ProductRow), images: product.images, imageUrl };
}

export async function updateProductRow(product: SavedProduct): Promise<void> {
  if (!product.productId) return;
  const uploaded = product.images.length ? await uploadPhotos(`products/${product.productId}`, product.images) : [];
  const { error } = await supabase
    .from("products")
    .update({
      name: product.productName,
      description: product.productDescription,
      price: product.productPrice,
      quantity: product.productQuantity,
      image_url: uploaded[0] ?? product.imageUrl ?? "",
      type: product.productType,
      details: product.details,
    })
    .eq("product_id", product.productId);

  if (error) throw error;
}

export async function deleteProductRow(productId: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("product_id", productId);
  if (error) throw error;
}

export async function listServices(businessId: string): Promise<SavedService[]> {
  const { data, error } = await supabase
    .from("services")
    .select("service_id, business_id, name, description, type, price, quantity, image_url, details")
    .eq("business_id", businessId);

  if (error) throw error;
  return (data ?? []).map((row) => toServiceData(row as ServiceRow));
}

export async function insertService(businessId: string, service: SavedService): Promise<SavedService> {
  const uploaded = service.images.length ? await uploadPhotos(`${businessId}/services`, service.images) : [];
  const { data, error } = await supabase
    .from("services")
    .insert({
      business_id: Number(businessId),
      name: service.serviceName,
      description: service.serviceDescription,
      type: service.serviceType,
      price: service.servicePrice,
      quantity: service.serviceQuantity,
      image_url: uploaded[0] ?? service.imageUrl ?? "",
      details: service.details,
    })
    .select("service_id, business_id, name, description, type, price, quantity, image_url, details")
    .single();

  if (error) throw error;
  return { ...toServiceData(data as ServiceRow), images: service.images };
}

export async function updateServiceRow(service: SavedService): Promise<void> {
  if (!service.serviceId) return;
  const uploaded = service.images.length ? await uploadPhotos(`services/${service.serviceId}`, service.images) : [];
  const { error } = await supabase
    .from("services")
    .update({
      name: service.serviceName,
      description: service.serviceDescription,
      type: service.serviceType,
      price: service.servicePrice,
      quantity: service.serviceQuantity,
      image_url: uploaded[0] ?? service.imageUrl ?? "",
      details: service.details,
    })
    .eq("service_id", service.serviceId);

  if (error) throw error;
}

export async function deleteServiceRow(serviceId: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("service_id", serviceId);
  if (error) throw error;
}
