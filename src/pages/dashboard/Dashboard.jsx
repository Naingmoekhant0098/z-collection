import { MetricCards } from "../../components/admin/cardList/index";
 
import AdminLayout from "../../layout/index";
import { UserTable } from "../../components/admin/user";
import VisitorInsightsChart from "../../components/admin/visitorChart";
import RevenueChart from "../../components/admin/revenueCharts";
import SatisfactionChart from "../../components/admin/satificationCharts";
import { TargetRealityChart } from "../../components/admin/targetCharts";
 

export default function Dashboard() {
  return (
  
      <main className="flex-1 overflow-y-auto ">
        <div className=" space-y-3 md:space-y-6">
          <div>
            <MetricCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            <VisitorInsightsChart />
            <RevenueChart />
            <SatisfactionChart />
            <TargetRealityChart />
          </div>
         
        </div>
      </main>
   
  );
}
