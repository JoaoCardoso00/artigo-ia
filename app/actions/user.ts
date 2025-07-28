import { createSupabaseServerActionClient } from "@/lib/supabase-server";

export async function handleNewUser(userId: string, email: string) {
  const supabase = await createSupabaseServerActionClient();

  const { data, error } = await supabase
    .from("users")
    .insert([{ id: userId, email }])
    .select();

  if (error) {
    return { error };
  }

  return { data };
}
