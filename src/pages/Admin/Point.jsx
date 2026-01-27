 
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
import { PlatformFeeTable } from "../../components/admin/platform";
import { PointTable } from "../../components/admin/point";


export default function PlatformList() {
    
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* <div>
            <CustomLists data={metrics} />
          </div> */}

          
          <PointTable />
        </div>
      </main>
    </AdminLayout>
  );
}
