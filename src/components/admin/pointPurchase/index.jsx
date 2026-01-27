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
  Cross,
  CircleX,
  SmilePlus,
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
import PointPurchase from "../../../services/PointPurchase";
import { Badge } from "../../ui/badge";

export function PointPurchaseTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [pointPurchases, setPointPurchase] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [type, setType] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState("desc");

  const [dashboardData, setDashboardData] = useState({
    total_purchase: 0,
    pending_purchase: 0,
    accepted_purchase: 0,
  });

  const fetchServices = async () => {
    const params = {
     
      page,
      per_page: perPage,
      order_by: order,
    };
    try {
      setIsLoading(true);
      const response = await PointPurchase.fetchPurchases(params);

      if (!response?.status || response.statusCode !== 200) {
        customToast.error(
          "Error Fetching Services",
          response?.message || "Something went wrong"
        );
        return;
      }
      setPointPurchase(response?.data?.data || []);
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
      title: "Total Point Purchases",
      value: dashboardData?.total_purchase,
      // change: "+2% from yesterday",
      icon: SmilePlus,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Accepted Point Purchases",
      value: dashboardData?.accepted_purchase,
      // change: "+1.5% from yesterday",
      icon: BadgeCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Point Purchases",
      value: dashboardData?.pending_purchase,
      // change: "-0.5% from yesterday",
      icon: CircleX,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  useEffect(() => {
    fetchServices();
  }, [perPage, page, order]);


  const handleStatusChange=async(id,status)=>{
   try{
   
    const response = await PointPurchase.updatePurchase(
        id,
        {status}
      );
      if (!response?.status || response.statusCode !== 200) {
        customToast.error(
          "Error Updating PointPurchase",
          response?.message || "Something went wrong"
        );
        return;
      }
      fetchServices();
      customToast.success("Success", "PointPurchase Updated");
    } catch (error) {
      console.error("Update PointPurchase Error:", error);
      customToast.error("An unexpected error occurred");
    }

  }

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
              Point Purchase
            </CardTitle>
            <p className="text-sm text-gray-600">Manage all point purchase listings</p>
          </div>
           
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center gap-4 mb-4">
            
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
                  <TableHead>#</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pointPurchases?.length > 0  ? pointPurchases?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post?.id || "-"}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {post?.user?.name || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {post?.user?.email || "-"}
                    </TableCell>
                    <TableCell className={`text-gray-700 font-semibold ${post?.status === 1 ? "text-green-500" : post?.status === 0 ? "text-amber-500" : "text-red-500"} `}>
                      {post.points}
                    </TableCell>

                    <TableCell className="text-green-600 font-semibold">
                      {post?.status == 0 ? (
                        <Badge className={` bg-amber-200  text-amber-600`}>
                          Pending
                        </Badge>
                      ) : post?.status == 1 ? (
                        <Badge className={` bg-green-100  text-green-600`}>
                          Approved
                        </Badge>
                      ) : (
                        <Badge className={` bg-red-100  text-red-600`}>
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        
                            
                            <DropdownMenuContent>
                              {post.status === 0 && (
                                <>
                                  <DropdownMenuItem
                                  className=" text-green-500"
                                    onClick={() =>
                                      handleStatusChange(post.id, 1)
                                    }
                                  >
                                   <BadgeCheck  className=" text-green-500" /> Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                   className=" text-red-500"
                                    onClick={() =>
                                      handleStatusChange(post.id, 2)
                                    }
                                  >
                                    <CircleX className=" text-red-500" />  Reject
                                  </DropdownMenuItem>
                                </>
                              )}

                              {post.status === 1 && (
                                <DropdownMenuItem
                                className=" text-red-500"
                                 onClick={() =>
                                   handleStatusChange(post.id, 2)
                                 }
                               >
                                 <CircleX className=" text-red-500" />  Reject
                               </DropdownMenuItem>
                              )}

                              {post.status === 2 && (
                                 <DropdownMenuItem
                                 className=" text-green-500"
                                   onClick={() =>
                                     handleStatusChange(post.id, 1)
                                   }
                                 >
                                  <BadgeCheck  className=" text-green-500" /> Approve
                                 </DropdownMenuItem>
                              )}
                           
                          

                          
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : 
                (
                    <TableCell colSpan={6} className=" text-center py-3">
                    There is no data yet! please create one
                  </TableCell>
                )
                
                }
              </TableBody>
            </Table>
          </div>

          {
            pointPurchases?.length > 0 && <div className="flex justify-between items-center px-4 py-2 mt-2">
            <div className="text-sm text-gray-500">
              {pointPurchases?.length} of {totalCount} row(s) selected.
            </div>
            <div className=" flex space-x-6 items-center">
              <div className=" flex items-center gap-4">
                <div className=" text-sm text-gray-500">Rows per page</div>
                <Select value={perPage.toString()} onValueChange={setPerPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                   
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

        {/* <OpenShareCreate
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
        /> */}
      </Card>
    </>
  );
}
