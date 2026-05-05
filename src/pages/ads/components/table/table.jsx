import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Loader2,
  PackageOpen,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import CustomPagination from "../../../../components/pagination/pagination";
import customToast from "../../../../components/customToast";

import { Form } from "../form/form";

export function AdsTable() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [per_page] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [Order, setOrder] = useState("desc");
  const [searchText] = useState("");

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("create");
  const [selectedPost, setSelectedPost] = useState(null);
 

  const handleSubmit = async (formData) => {
    try {
      const { _id, views, clicks, createdAt, updatedAt, __v, ...restData } =
        formData;
      const action =
        type === "create"
          ? BannerService().create(restData)
          : BannerService().updateByIdPut(selectedPost._id, restData);

      const res = await action;
      if (res.status) {
        customToast.success(
          "Success",
          `Banner ${type === "create" ? "created" : "updated"}!`
        );
        setIsOpen(false);
        fetchAds();
      }
    } catch (error) {
      customToast.error("Error", "Operation failed");
    }
  };

  const handleDelete = async (id) => {
     
    try {
      const res = await BannerService().deleteById(id);
      if (res.status) {
        customToast.success("Deleted", "Banner removed");
        fetchAds();
      }
    } catch (error) {
      customToast.error("Error", "Delete failed");
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page, Order]);

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Advertisements</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Banner Campaigns</h1>
          <p className="text-sm text-gray-500">
            Manage promotional banners and links
          </p>
        </div>
        <Button
          onClick={() => {
            setType("create");
            setSelectedPost(null);
            setIsOpen(true);
          }}
          className="bg-black hover:bg-hoverMain text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Banner
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <Select value={Order} onValueChange={setOrder}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-none border  p-0 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black">
                <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                  Preview
                </TableHead>
                <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                  Priority / Size
                </TableHead>
                <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
               Type
                </TableHead>
                <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                  Destination
                </TableHead>
                <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                  Status
                </TableHead>
                <TableHead className="text-white text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto h-8 w-8 text-gray-300" />
                  </TableCell>
                </TableRow>
              ) : ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad._id} className="hover:bg-gray-50">
                    <TableCell className="border-r text-center">
                      <img
                        src={ad.image}
                        className="h-12 w-24 object-contain mx-auto rounded border"
                        alt="Banner"
                      />
                    </TableCell>
                    <TableCell className="border-r text-center">
                      <div className="text-sm font-bold">P: {ad.priority}</div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        {ad.size || "Large"}
                      </div>
                    </TableCell>
                    <TableCell className="border-r text-center">
                      <div className="text-xs bg-amber-300/30  capitalize px-2  font-medium py-1  rounded-sm"> {ad.type}</div>
                       
                    </TableCell>
                    <TableCell className="border-r text-center">
                      <a
                        href={ad.link}
                        target="_blank"
                        className="text-blue-500 flex items-center justify-center gap-1 text-xs hover:underline"
                      >
                        Open Link <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="border-r text-center">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold",
                          ad.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {ad.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPost(ad);
                              setType("edit");
                              setIsOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(ad._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <PackageOpen className="mx-auto h-12 w-12 text-gray-200" />
                    <p className="mt-2 text-gray-500">No banners found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t">
            <CustomPagination
              currentPage={page}
              totalPages={totalPage}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      <Form
        isOpen={isOpen}
        type={type}
        handleColse={() => setIsOpen(false)}
        handleSubmit={handleSubmit}
        selectedPost={selectedPost}
      />
    </>
  );
}
