import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  DollarSign,
  UserX,
  BadgeCheck,
  Shapes,
} from "lucide-react";
import { Input } from "../../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import customToast from "../../customToast";
import Pagination from "../customPagination";
import OpenShareService from "../../../services/OpenShareService";
import { PostCreate } from "../Dialogs/post";
import { PostDetail } from "../Dialogs/post/postDetail";
import { CustomLists } from "../customCardlist";
import { OpenShareCreate } from "../Dialogs/OpenShare";

export function OpenShareTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [type, setType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState("desc");
 
  const [dashboardData, setDashboardData] = useState({
    total_openshare: 0,
    active_openshare: 0,
    total_price: 0,
  });

  const fetchServices = async () => {
    const params = {
      search: searchText,
      page,
      per_page: perPage,
      order_by: order,
    };
    try {
      setIsLoading(true);
      const response = await OpenShareService.fetchShares(params);
 
      if (!response?.status || response.statusCode !== 200) {
        customToast.error(
          "Error Fetching Services",
          response?.message || "Something went wrong"
        );
        return;
      }
      setServices(response?.data?.data || []);
      setDashboardData(response?.dashboardData || {});
      setTotalCount(response?.data?.total || 0);
      setTotalPage(response?.data?.last_page || 1);
    } catch (error) {
      console.error("Fetch Services Error:", error);
      customToast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  

  const metrics = [
    {
      title: "Total ShareOpen",
      value: dashboardData?.total_openshare,
      // change: "+2% from yesterday",
      icon: Shapes,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active OpenShare",
      value: dashboardData?.active_openshare,
      // change: "+1.5% from yesterday",
      icon: BadgeCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Price",
      value: dashboardData?.total_price,
      // change: "-0.5% from yesterday",
      icon: DollarSign,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  useEffect(() => {
    fetchServices();
  }, [searchText, perPage, page, order]);

  const handleSubmit = async (payload) => {
    if (type === "createPost") {
      try {
        const response = await OpenShareService.createShare(payload);
        if (!response?.status || response.statusCode !== 200) {
          customToast.error(
            "Error Creating Service",
            response?.message || "Something went wrong"
          );
          return;
        }
        fetchServices();
        customToast.success("Success", "Service Created");
      } catch (error) {
        console.error("Create Service Error:", error);
        customToast.error("An unexpected error occurred");
      }
    } else {
      try {
        const response = await OpenShareService.updateShare(
          selectedPost?.id,
          payload
        );
        if (!response?.status || response.statusCode !== 200) {
          customToast.error(
            "Error Updating Service",
            response?.message || "Something went wrong"
          );
          return;
        }
        fetchServices();
        customToast.success("Success", "Service Updated");
      } catch (error) {
        console.error("Update Service Error:", error);
        customToast.error("An unexpected error occurred");
      }
    }
    setIsOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await OpenShareService.deleteShare(id);
      if (!response?.status || response.statusCode !== 200) {
        customToast.error("Error Deleting Service", response?.message);
        return;
      }
      fetchServices();
      customToast.success("Success", response?.message);
    } catch (error) {
      console.error("Delete Service Error:", error);
    }
  };

  return (
    <>
      <CustomLists data={metrics} />
      <Card className="w-full border-0 shadow-sm">
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Open Shares
            </CardTitle>
            <p className="text-sm text-gray-600">Manage all open shares listings</p>
          </div>
          <Button
            onClick={() => {
              setIsOpen(true);
              setType("createPost");
            }}
            className="bg-main hover:bg-hoverMain text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center gap-4 mb-4">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search services..."
              className="w-[250px]"
            />
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">ASC</SelectItem>
                <SelectItem value="desc">DESC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services?.length > 0 ? services?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="h-10 w-10 rounded-md object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/images/placeholder.png")
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {post.investment}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {post.description}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      ${post.price}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPost(post);
                              setIsOpenDetail(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPost(post);
                              setType("editPost");
                              setIsOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
                :(
                  <TableCell colSpan={6} className=" text-center py-3">
                    There is no data yet! please create one
                  </TableCell>
                )
              
              }
              </TableBody>
            </Table>
          </div>

         {
          services?.length > 0 &&  <div className="flex justify-between items-center px-4 py-2 mt-2">
          <div className="text-sm text-gray-500">
            {services?.length} of {totalCount} row(s) selected.
          </div>
          <div className=" flex space-x-6 items-center">
                       <div className=" flex items-center gap-4">
                         <div className=" text-sm text-gray-500">Rows per page</div>
                         <Select value={perPage.toString()} onValueChange={setPerPage}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="1">1</SelectItem>
                             <SelectItem value="5">5</SelectItem>
                             <SelectItem value="10">10</SelectItem>
                             <SelectItem value="25">25</SelectItem>
                             <SelectItem value="50">50</SelectItem>
                             <SelectItem value="100">100</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className=" flex space-x-6 items-center">
                         <Pagination
                           currentPage={page}
                           totalPages={totalPage}
                           onPageChange={(p) => setPage(p)}
                         />
                       </div>
                     </div>
        </div>
         }
        </CardContent>

        <OpenShareCreate
          isOpen={isOpen}
          type={type}
          handleColse={() => {
            setIsOpen(false);
            setSelectedPost(null);
          }}
          handleSubmit={handleSubmit}
          selectedPost={selectedPost}
        />

        <PostDetail
          post={selectedPost}
          isOpen={isOpenDetail}
          handleClose={() => {
            setSelectedPost(null);
            setIsOpenDetail(false);
          }}
        />
      </Card>
    </>
  );
}
