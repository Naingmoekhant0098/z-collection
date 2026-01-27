 
import AdminLayout from "../../layout/index";
import { UserTable } from "../../components/admin/user";
import { Users, UserCheck, UserX } from "lucide-react" 


import { CustomLists } from "../../components/admin/customCardlist";
import { PostTable } from "../../components/admin/posts";
import { ChatTable } from "../../components/admin/chats";
 


export default function Chat() {
    const metrics = [
        {
          title: "Total Chats",
          value: "5,432",
          change: "+2% from yesterday",
          icon: Users,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          title: "Active Chats",
          value: "3,210",
          change: "+1.5% from yesterday",
          icon: UserCheck,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          title: "Inactive Chats",
          value: "48",
          change: "-0.5% from yesterday",
          icon: UserX,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
        },
      ];
      
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <CustomLists  data={metrics}/>
          </div>
          <ChatTable />
        </div>
      </main>
    </AdminLayout>
  );
}
