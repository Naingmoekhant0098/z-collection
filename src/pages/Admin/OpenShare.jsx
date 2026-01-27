 
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
import { OpenShareTable } from "../../components/admin/openshare";


export default function OpenShare() {
   
     
      
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <OpenShareTable />
        </div>
      </main>
    </AdminLayout>
  );
}
