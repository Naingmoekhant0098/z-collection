
import { Users, UserCheck, UserX } from "lucide-react" 
import { PostTable } from "../../components/admin/posts";
import { UserTable } from "./components/table/table";
 


export default function User() {
  return (
    
    <main className="flex-1 overflow-y-auto ">
        <div className=" space-y-3 md:space-y-6">
          <UserTable />
        </div>
      </main>
    
  );
}
