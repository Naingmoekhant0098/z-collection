import { useEffect, useState } from "react";
import { Search, File, ListFilter, Plus } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import CustomPagination from "../../../components/pagination/pagination";
import customToast from "../../../components/customToast";
import OrderCard from "./order_card"; // The component above
import { DatePickerWithRange } from "../../../components/admin/products/components/date_picker";
import { format, set } from "date-fns";
import { OrderService } from "../../../services/OrderService";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderCardSkeleton from "./order_loading";

export function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing"); // ongoing | history
  const [filter, setFilter] = useState("all"); // all | current | awaiting
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [date, setDate] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService().fetchAll({
        page,
        search: searchText,
        status: filter !== "all" ? filter : undefined,
        tab: activeTab,
        fromDate: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
        toDate: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      });
      if (response.data?.success) {
        setOrders(response.data?.data?.orders || []);
        setTotalPage(response?.data?.data?.totalPages || 1);
        
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      customToast.error("Error loading orders");
    }
  };

    const generateExcel = async () => {
      try {
        
        const fromStr = date?.from ? format(date?.from, "yyyy-MM-dd") : undefined;
        const toStr = date?.to ? format(date?.to, "yyyy-MM-dd") : undefined;
        const blob = await await OrderService().generateExcelProduct({
          fromDate: fromStr,
          toDate: toStr,
          search: searchText,
          status: filter !== "all" ? filter : undefined,
        });
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Inventory_Report_${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        // setIsExporting(false);
      } catch (error) {
        // setIsExporting(false);
        console.log(error);
        customToast.error("Export Failed", "Could not generate Excel file");
      }
    };




  useEffect(() => {
    fetchOrders();
  }, [page, searchText, filter, activeTab, date]);

  return (
    <div className="">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">
        <div className=" flex items-center justify-between ">
          <DatePickerWithRange date={date} setDate={setDate} />

          <div className=" flex gap-1">
            <Button
              onClick={() => {
                  generateExcel();
              }}
              className="bg-emerald-600 text-white font-normal rounded-4xl py-2! text-xs"
            >
              <File className="h-3 w-3" />
              Export
            </Button>
            <Button
              onClick={() => {
                navigate("/admin/orders/create");
              }}
              className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
            >
              <Plus className="h-3 w-3" />
              Add New
            </Button>
          </div>
        </div>
        {/* Search and Date */}
        <div className="pb-4 flex flex-col md:flex-row  mt-2 gap-1">
          <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                filter === "all"
                  ? "bg-main text-white border-main"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border flex gap-2 items-center ${
                filter === "paid"
                  ? "bg-main text-white border-main"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              Paid
            
            </button>
            <button
              onClick={() => setFilter("unpaid")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border flex gap-2 items-center ${
                filter === "unpaid"
                  ? "bg-main text-white border-main"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              Unpaid
               
            </button>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-9 bg-gray-50 text-[14px] border-none rounded-xl"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className=" flex flex-col gap-3 mt-2 ">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order._id} order={order} />)
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              No orders found
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <CustomPagination
          currentPage={page}
          totalPages={totalPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
