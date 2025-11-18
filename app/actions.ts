"use server";

import { createClient } from "@/utils/supabase/server";

export async function addMember(result: any) {
  const supabase = await createClient();

  const { data: any, error } = await supabase
    .from("members")
    .insert([
      {
        name: result.name,
        email: result.email,
        phone: result.phone,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return result;
}
