import Link from "next/link";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold">Welccome to Local Loop</h1>

    <nav>
      <li><Link href="/login">Log In</Link></li>
      <li><Link href="/explore">Explore</Link></li>
      <li><Link href="/product">Products</Link></li>
      <li><Link href="/create">Create a new Business Account</Link></li>
    </nav>

    </main>

  );
}
