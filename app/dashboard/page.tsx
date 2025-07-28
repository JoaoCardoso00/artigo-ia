import { signOut } from "@/app/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  async function handleSignOut() {
    "use server";
    await signOut();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {data.user.email}</p>
      <form action={handleSignOut}>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
