import MemberFormContainer from "@/components/MemberFormContainer";
import MemberTable from "@/components/MemberTable";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="w-5/6 lg:w-3/4 mx-auto mt-10">
        <MemberFormContainer />
        <MemberTable />
      </div>
    </div>
  );
}
