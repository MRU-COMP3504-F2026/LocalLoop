import Link from "next/link";

export default function ListingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 md:px-8">
      <h1 className="font-serif text-4xl text-loop-green-dark">Listings</h1>
      <ul className="mt-6 list-disc space-y-2 pl-5">
        <li><Link href="/registerProduct">Register Products</Link></li>
        <li><Link href="/registerService">Register Service</Link></li>
      </ul>
    </main>
  );
}
