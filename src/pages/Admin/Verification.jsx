 
import AdminLayout from "../../layout/index";
import { UserTable } from "../../components/admin/user";
import {
    DollarSign,
    Percent,
    CreditCard,
    Users,
    UserCheck,
    MessageSquare
  } from "lucide-react";
  

import { CustomLists } from "../../components/admin/customCardlist";
 
import { VerificationTable } from "../../components/admin/verification";


export default function VerificationList() {
   
      const metrics = [
        {
          title: "Total Revenue",
          value: "$152,340",
          change: "+4.7% from last week",
          icon: DollarSign,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          title: "Platform Fees Earned",
          value: "$12,450",
          change: "+3.2% from last week",
          icon: Percent,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
        },
        {
          title: "Total Transactions",
          value: "18,329",
          change: "+6.5% from last week",
          icon: CreditCard,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          title: "Active Sellers",
          value: "1,245",
          change: "+2.1% from last week",
          icon: Users,
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        },
        {
          title: "Active Buyers",
          value: "3,870",
          change: "+3.9% from last week",
          icon: UserCheck,
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600",
        },
        {
          title: "Open Support Tickets",
          value: "73",
          change: "-1.4% from last week",
          icon: MessageSquare,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
        },
      ];
      
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <CustomLists data={metrics} />
          </div>

          
          <VerificationTable />
        </div>
      </main>
    </AdminLayout>
  );
}
