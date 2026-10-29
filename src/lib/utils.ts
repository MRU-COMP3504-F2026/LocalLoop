import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseURL,supabaseAnonKey);

// Code for connecting to supabase
//import { supabase } from "@/lib/utils";
// const {data: users, error } = await supabase.from("User").select();
// if(error){
//   return <p className="text-red-500">Failed to load users:{error.message}</p>;
// }