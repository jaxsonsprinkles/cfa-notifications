"use server";

import { NewEventEmailTemplate } from "@/components/EmailTemplate";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

export async function getMembers() {
  const supabase = await createClient();
  const { data } = await supabase.from("members").select("*");
  return data || [];
}

export async function addMember(data: any) {
  const supabase = await createClient();
  const { data: result, error } = await supabase
    .from("members")
    .insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return result;
}

export async function removeMember(id: bigint) {
  const supabase = await createClient();

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function addEvent(result: any) {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("events")
    .insert([
      {
        title: result.title,
        description: result.description,
        date: result.date,
        time: result.time,
        located_at: result.located_at,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Send announcement emails to all members
  const { data: members } = await supabase.from("members").select("*");
  if (members && members.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const event = inserted ?? result;
    await Promise.allSettled(
      members.map((member: any) =>
        resend.emails.send({
          from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
          to: member.email,
          subject: `New event: ${event.title}`,
          react: NewEventEmailTemplate({
            firstName: member.name?.split(" ")[0] ?? member.name,
            event,
          }),
        })
      )
    );
  }

  return inserted ?? result;
}

export async function removeEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
