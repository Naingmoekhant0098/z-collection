 
import AdminLayout from "../../layout/index";
import { UserTable } from "../../components/admin/user";
 
import { CustomLists } from "../../components/admin/customCardlist";
 
import { VerificationTable } from "../../components/admin/verification";
import { OpenShareTable } from "../../components/admin/openshare";
import { PointPurchaseTable } from "../../components/admin/pointPurchase";


export default function PointPurchase() {
   
    
      
  return (
    <AdminLayout>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <PointPurchaseTable />
        </div>
      </main>
    </AdminLayout>
  );
}
