import { Suspense } from "react";
import ProductDetail from "@/app/(site)/business/[id]/product/[productId]/productDetail";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-loop-cream" />}>
      <ProductDetail />
    </Suspense>
  );
}
