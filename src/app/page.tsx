import Link from "next/link";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold">Welcome to Local Loop</h1>

    <nav>
      <li><Link href="/login/publishing">Log In</Link></li>
      <li><Link href="/explore">Explore</Link></li>
      <li><Link href="/register">Create a new Account</Link></li>
      <li><Link href="/registerProduct">Register Products</Link></li>
      <li><Link href="/registerService">Register Service</Link></li>
      <li><Link href="/dashboard">Dashboard</Link></li>
    </nav>

    </main>

  );
}
