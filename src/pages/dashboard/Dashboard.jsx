import { MetricCards } from "./components/cardList";
import RevenueChart from "./components/revenueCharts";
import OrderStatusChart from "./components/targetCharts";
import { CustomerTable } from "./components/customer";
import FilterBar from "./components/filterBar";
import { RecentOrderTable } from "./components/order";
import { useEffect, useState } from "react";
import { DashboardService } from "../../services/DashboardService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [metricData, setMetricData] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    categories: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [yearCompareData, setYearCompareData] = useState([]);
  const [orderStatus, setOrderStatus] = useState();
  const fetchDashboardData = async () => {
    try {
      const params = {
        period: selectedFilter,
      };

      const response = await DashboardService().fetchAll(params);

      setMetricData({
        products: response?.data?.stats?.checkTotal?.products ?? 0,
        orders: response?.data?.stats?.checkTotal?.orders ?? 0,
        customers: response?.data?.stats?.checkTotal?.customers ?? 0,
        categories: response?.data?.stats?.checkTotal?.categories ?? 0,
      });
      setYearCompareData(response?.data?.stats?.getMonthlyRevenueCosts);
      setOrderStatus(response?.data?.stats?.orderStatus);
      setRecentCustomers(response?.data?.stats?.recentCustomers);
      setRecentOrders(response?.data?.stats?.recentOrders);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedFilter]);

  return (
    <main className="flex-1 mt-14  md:mt-0 overflow-y-auto ">
       <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          
          
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" space-y-3 md:space-y-6">
        <div>
          <FilterBar
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
         <div  className=" flex flex-col md:flex-col-reverse gap-6 " >
         <RevenueChart yearCompareData={yearCompareData} />
         <MetricCards metricData={metricData} />
         </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-3 md:gap-6">
          <OrderStatusChart orderStatus={orderStatus} />

          <RecentOrderTable recentOrders={recentOrders} />
          <CustomerTable recentCustomers={recentCustomers} />
        </div>
      </div>
    </main>
  );
}
