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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import CustomPagination from "../../../components/pagination/pagination";
import customToast from "../../../components/customToast";
import OrderCard from "./order_card";
import { DatePickerWithRange } from "../../../components/admin/products/components/date_picker";
import { format, set } from "date-fns";
import { OrderService } from "../../../services/OrderService";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderCardSkeleton from "./order_loading";

export function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [payment_method, setPaymentMethod] = useState();
  const [status, setStatus] = useState();
  const [paymentStatus, setPaymentStatus] = useState();
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
        paymentStatus,
        paymentMethod: payment_method,
        status,
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
        paymentStatus,
        paymentMethod: payment_method,
        status,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Inventory_Report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      customToast.error("Export Failed", "Could not generate Excel file");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchText, date, paymentStatus, payment_method, status]);

  return (
    <div className=" mt-11 md:mt-0">
      <Breadcrumb className="mb-5">
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
        {/* <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-9 bg-gray-50 text-[14px] border-none rounded-xl"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div> */}
        <div className=" flex items-center  flex-wrap-reverse gap-3 justify-end md:justify-between ">
          <div className=" grid grid-cols-2 md:grid-cols-4 flex-wrap gap-2">
            <DatePickerWithRange date={date} setDate={setDate} />

            <Select
              value={payment_method}
              onValueChange={(val) => setPaymentMethod(val)}
            >
              <SelectTrigger className="w-full h-10 text-xs text-slate-700 border-slate-200 rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-sm border-slate-100">
                <SelectItem
                  
                  className="text-xs text-blue-700 cursor-pointer"
                >
                  All
                </SelectItem>

                <SelectItem
                  value="COD"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  Cash on Delivery (COD)
                </SelectItem>
                <SelectItem
                  value="cash"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  Cash
                </SelectItem>
                <SelectItem
                  value="kpay"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  KPay
                </SelectItem>
                <SelectItem
                  value="wave"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  Wave Pay
                </SelectItem>
                <SelectItem
                  value="banking"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  Mobile Banking
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger className="w-full h-10 text-xs text-slate-700 border-slate-200 rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none">
                <SelectValue placeholder="Select Fulfillment Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-sm border-slate-100">
                <SelectItem className="text-xs text-slate-700 cursor-pointer">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                    All
                  </span>
                </SelectItem>

                <SelectItem
                  value="pending"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                    Pending
                  </span>
                </SelectItem>
                <SelectItem
                  value="delivered"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                    Delivered
                  </span>
                </SelectItem>
                <SelectItem
                  value="cancelled"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                    Cancelled
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={paymentStatus}
              onValueChange={(val) => setPaymentStatus(val)}
            >
              <SelectTrigger className="w-full h-10 text-xs text-slate-700 border-slate-200 rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none">
                <SelectValue placeholder="Select Financial Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-sm border-slate-100">
                <SelectItem className="text-xs text-slate-700 cursor-pointer">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                    All
                  </span>
                </SelectItem>

                <SelectItem
                  value="unpaid"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                    Unpaid
                  </span>
                </SelectItem>
                <SelectItem
                  value="paid"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                    Paid
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <DatePickerWithRange date={date} setDate={setDate} />
          <DatePickerWithRange date={date} setDate={setDate} /> */}

          <div className=" flex justify-between gap-2 w-full">
            <div className="relative   w-full md:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 text-xs"
                placeholder="Search order..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1);
                }}
              />
            </div>

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
                  navigate("/orders/create");
                }}
                className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-2  md:gap-3 ">
          {isLoading ? (
            [...Array(9)].map((_, i) => <OrderCardSkeleton key={i} />)
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                refresh={fetchOrders}
                // onDelete={(targetOrder) => handleYourDeleteModal(targetOrder)}
                // onEdit={(orderId) => handleYourEditRedirect(orderId)}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center text-gray-400 text-sm bg-white border border-slate-100 rounded-xl">
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
