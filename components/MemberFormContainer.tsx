"use client";

import { addMember } from "@/app/actions";
import MemberForm from "./MemberForm";
import { useMembers } from "@/context/MembersContext";
import { useState } from "react";

export default function MemberFormContainer() {
  const { triggerRefresh } = useMembers();
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: any) => {
    setLoading(true);
    await addMember(data);
    triggerRefresh();
    setLoading(false);
  };

  return <MemberForm onSubmit={onSubmit} loading={loading} />;
}
