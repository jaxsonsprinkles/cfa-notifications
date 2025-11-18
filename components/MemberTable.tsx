"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMembers } from "@/app/actions";
import { useEffect, useState } from "react";
import { useMembers } from "@/context/MembersContext";

export default function MemberTable() {
  const [members, setMembers] = useState<any[]>([]);
  const { refreshTrigger } = useMembers();

  useEffect(() => {
    const loadData = async () => {
      const data = await getMembers();
      setMembers(data);
    };

    loadData();
  }, [refreshTrigger]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map((member) => {
          return (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
