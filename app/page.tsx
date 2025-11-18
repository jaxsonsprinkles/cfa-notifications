import MemberFormContainer from "@/components/MemberFormContainer";
import MemberTable from "@/components/MemberTable";
import Navbar from "@/components/Navbar";
import { MembersProvider } from "@/context/MembersContext";

export default async function Dashboard() {
  return (
    <MembersProvider>
      <div>
        <Navbar />
        <div className="w-5/6 lg:w-3/4 mx-auto mt-10">
          <MemberFormContainer />
          <MemberTable />
        </div>
      </div>
    </MembersProvider>
  );
}
