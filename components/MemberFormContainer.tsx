"use client";

import { addMember } from "@/app/actions";
import MemberForm from "./MemberForm";

export default function MemberFormContainer() {
  const onSubmit = async (data: any) => {
    await addMember(data);
  };

  return <MemberForm onSubmit={onSubmit} />;
}
