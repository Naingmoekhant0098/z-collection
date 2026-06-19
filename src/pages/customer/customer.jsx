import { Users, UserCheck, UserX } from "lucide-react";
// import { PostTable } from "../../components/admin/products";
import { CustomerTable } from "./components/table/table";

export default function Customer() {
  return (
    <main className="flex-1 overflow-y-auto  mt-13 md:mt-0">
      <div className=" space-y-3 md:space-y-6">
        <CustomerTable />
      </div>
    </main>
  );
}
