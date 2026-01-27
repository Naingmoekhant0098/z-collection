import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PostCreate } from "../Dialogs/post";
import { PostDetail } from "../Dialogs/post/postDetail";
import { Input } from "../../ui/input";
import { PointEdit } from "../Dialogs/Point";
import PointService from "../../../services/PointService";
import customToast from "../../customToast";
import { DeleteAccountConfirmation } from "../Dialogs/deleteAccount";

const pre_posts = [
  {
    id: 1,
    point: "1",

    fee: 1500,

    createdAt: "2024-08-15",
  },
];

export function PointTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [posts, setPosts] = useState([...pre_posts]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [type, setType] = useState("");
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPoints = async () => {
    try {
      setIsLoading(true);
      const response = await PointService.fetchPoints();
      if (!response?.status || response?.statusCode !== 200) {
        customToast.error(
          "Error Fetching Points",
          response?.message || "Something went wrong"
        );
        return;
      }
      setPoints(response.data || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      customToast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      
      const response = await PointService.updatePoint(
        selectedPost?.id,
        payload
      );
      if (!response?.status || response?.statusCode !== 200) {
        customToast.error(
          "Error Updating Points",
          response?.message || "Something went wrong"
        );
        return;
      }
      handleClose();
      fetchPoints();
      customToast.success("Success", "Point Updated");
    } catch (error) {
      console.error("Error Updating Point Error:", error);
      customToast.error("An unexpected error occurred");
    }
    setIsOpen(false);
    setSelectedPost(null);
  };
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = (point) => {
    setDeleteOpen(true);
    setSelectedPost(point);
    // setPosts(posts.filter((post) => post.id !== id));
  };

  const deletePoint = async(id)=>{
 try {
      const response = await PointService.deletePoint(id);
      if (!response?.status || response?.statusCode != 200) {
        customToast.error("Error Deleting User", response?.message);
      }
      if (response?.status && response?.statusCode === 200) {
        fetchPoints();
      
        customToast.success("Success", response?.message);
      }
    } catch (error) {}
    
  };
  
  const handleClose = () => {
    console.log("close");
    setIsOpen(false);
    setSelectedPost(null);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <Card className="w-full border-0 shadow-sm ">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Points
          </CardTitle>
          <p className="text-sm text-gray-600">Manage all point listings</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="rounded-lg border overflow-hidden">
          <Table className="">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>#</TableHead>
                <TableHead>Point</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {points?.length> 0 ? points.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium text-gray-900">
                    {post.id}
                  </TableCell>
                  <TableCell className="text-gray-700">{post.point}</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    ${post.fee}
                  </TableCell>

                  <TableCell className="text-gray-600">
                    {new Date(post.created_at).toLocaleDateString()}
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

                            setIsOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post)}
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
               :
               (
                <TableCell colSpan={6} className=" text-center py-3">
                There is no data yet! please create one
              </TableCell>
               )
            }
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex justify-between items-center px-4 py-2 mt-2">
          <div className=" text-[14px] text-gray-500">
            0 of 100 row(s) selected.
          </div>
          <div className=" flex space-x-6 items-center">
            <div className=" flex gap-1 items-center">
              <div className=" text-[14px] text-gray-500">Rows per page</div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">5</SelectItem>
                  <SelectItem value="dark">10</SelectItem>
                  <SelectItem value="system">25</SelectItem>
                  <SelectItem value="system">50</SelectItem>
                  <SelectItem value="system">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className=" flex space-x-6 items-center">
              <div className=" text-[14px] text-gray-500">Page 1 of 10</div>
              <div className=" flex space-x-3 items-center">
                <Button>
                  <ChevronLeft />
                </Button>
                <Button variant={"outline"}>1</Button>
                <Button variant={"outline"}>1</Button>

                <Button variant={"outline"}>
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div> */}
      </CardContent>
      {isOpen && (
        <PointEdit
          isOpen={isOpen}
          type={type}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          selectedPost={selectedPost}
        />
      )}

      {deleteOpen && (
        <DeleteAccountConfirmation
          isOpen={deleteOpen}
          handleClose={() => setDeleteOpen(false)}
          data={selectedPost}
          type={"Point"}
          handleDelete={deletePoint}
        />
      )}
    </Card>
  );
}
