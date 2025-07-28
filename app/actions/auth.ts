"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerActionClient } from "@/lib/supabase-server";

export async function signInWithEmail(email: string) {
  const supabase = await createSupabaseServerActionClient();
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        type: error.code,
      },
    };
  }

  return { error: null };
}

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerActionClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message,
        type: error.code,
      },
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: null };
}

export async function signOut() {
  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: {
        message: error.message,
        type: error.code,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/login");

  return { error: null };
}