import Link from "next/link";
import PageFrame from "@/components/pageFrame";

const listings = [
  { href: "/registerProduct", label: "Register Products", detail: "Add something you sell" },
  { href: "/registerService", label: "Register Service", detail: "Add something you offer" },
];

export default function ListingsPage() {
  return (
    <PageFrame
      eyebrow="your shop"
      title="listings"
      description="Products and services customers can find."
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {listings.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-[28px] bg-white p-5 hover:bg-loop-sage"
            >
              <span>
                <span className="block font-serif text-2xl">{item.label}</span>
                <span className="mt-1 block text-sm text-loop-green">{item.detail}</span>
              </span>
              <span aria-hidden="true" className="text-loop-green">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
