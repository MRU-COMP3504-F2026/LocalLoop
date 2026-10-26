import { supabase } from "@/lib/utils";

export default async function Home() {
  const {data: users, error } = await supabase.from("User").select();

  if(error){
    return <p className="text-red-500">Failed to load users:{error.message}</p>;
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold">Hello, LocalLoop</h1>
    </main>
  );
}
