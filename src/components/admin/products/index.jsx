import { Button } from "../../ui/button";
import { Plus, PackageOpen, Search, File } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import customToast from "../../customToast";
import CustomPagination from "../../pagination/pagination";
import { ProductService } from "../../../services/PostService";
import { useNavigate } from "react-router-dom";
import ProductCard from "./components/product_card";
import { DatePickerWithRange } from "./components/date_picker";
import { format, toDate } from "date-fns";
import OrderCardSkeleton from "../../../pages/orders/components/order_loading";

export function ProductTable() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [date, setDate] = useState(null);

  const [order, setOrder] = useState("desc");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await ProductService().fetchAll({
        page,
        search: searchText,
        order,
        fromDate: date ? format(date.from, "yyyy-MM-dd") : undefined,
        toDate: date ? format(date.to, "yyyy-MM-dd") : undefined,
      });

      if (response.data?.success) {
        setProducts(response.data?.data?.products || []);

        setCurrent(response.data?.data?.page || 1);
        setTotalPage(
          Math.ceil(
            (response?.data?.data?.total || 0) /
              (response?.data?.data?.limit || 1)
          ) || 1
        );
      } else {
        customToast.error("Error Fetching Products", response?.message);
      }
    } catch (err) {
      customToast.error("Unexpected error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchText, order, date]);

  const handleDelete = async (id) => {
    try {
      const res = await ProductService().deleteById(id);

      if (res?.success) {
        fetchProducts();
        customToast.success("Deleted Successfully");
      } else {
        customToast.error("Delete Failed");
      }
    } catch (err) {
      customToast.error("Unexpected error");
    }
  };

  const generateExcel = async () => {
    try {
      setIsExporting(true);
      const fromStr = date?.from ? format(date?.from, "yyyy-MM-dd") : undefined;
      const toStr = date?.to ? format(date?.to, "yyyy-MM-dd") : undefined;
      const blob = await await ProductService().generateExcelProduct({
        fromDate: fromStr,
        toDate: toStr,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Inventory_Report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      console.log(error);
      customToast.error("Export Failed", "Could not generate Excel file");
    }
  };

  const onPageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-4 mt-3">
        <div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <div className=" flex gap-2">
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
              navigate("/admin/products/create");
            }}
            className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
          >
            <Plus className="h-3 w-3" />
            Add New
          </Button>
        </div>
      </div>
      <div className="flex justify-between mb-4 gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 text-sm"
            placeholder="Search product..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 w-full md:grid-cols-3 lg:grid-cols-3 gap-3 mb-4">
        {isLoading
          ? [...Array(10)].map((_, i) => <OrderCardSkeleton key={i} />)
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      <CustomPagination
        currentPage={current}
        totalPages={totalPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
