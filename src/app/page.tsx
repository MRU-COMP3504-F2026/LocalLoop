import Link from "next/link";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold">Hello, LocalLoop</h1>

    <nav>
      <li><Link href="/login">Log In</Link></li>
      <li><Link href="/explore">Explore</Link></li>
      <li><Link href="/registerProduct">Register Products</Link></li>
      <li><Link href="/registerService">Register Service</Link></li>

    </nav>

    </main>

  );
}
