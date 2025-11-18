import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function Instruments() {
  const supabase = await createClient();
  const { data: members } = await supabase.from("members").select();
  return (
    <div>
      <Navbar />
      {members?.map((member) => {
        return <div key={member.id}>{member.name}</div>;
      })}
    </div>
  );
}
