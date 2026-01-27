import { Card, CardContent } from "../../ui/card";
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
  PackageOpen,
  Search,
} from "lucide-react";
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
import { PostCreate } from "../Dialogs/post";
import { PostDetail } from "../Dialogs/post/postDetail";
import { Input } from "../../ui/input";

import customToast from "../../customToast";
import CustomPagination from "../../pagination/pagination";
import { PostService } from "../../../services/PostService";

export function PostTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [services, setServices] = useState([]); // This holds your blog data
  const [selectedPost, setSelectedPost] = useState(null);
  const [type, setType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [per_page, setPer_Page] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [Order, setOrder] = useState("desc");

  const handleSubmit = async (payload) => {
    if (type === "createPost") {
      try {
        const response = await PostService().create(payload);
        if (!response?.status) {
          customToast.error("Error Creating Post", response?.message);
          return;
        }
        fetchPosts();
        customToast.success("Success", "Post Created");
      } catch (error) {
        customToast.error("An unexpected error occurred");
      }
    } else {
      try {
        const {_id,slug,__v,createdAt,updatedAt,...restPayload} = payload;
        const response = await PostService().updateByIdPut(selectedPost?._id, restPayload);
        if (!response?.status) {
          customToast.error("Error Updating Post", response?.message);
          return;
        }
        fetchPosts();
        customToast.success("Success", "Post Updated");
      } catch (error) {
        customToast.error("An unexpected error occurred");
      }
    }
    setIsOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await PostService().deleteById(id);
      if (response?.status) {
        fetchPosts();
        customToast.success("Success", response?.message);
      } else {
        customToast.error("Error Deleting Post", response?.message);
      }
    } catch (error) {
        customToast.error("An unexpected error occurred");
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await PostService().fetchAll({
        page: page,
        per_page: per_page,
        search: searchText,
        order: Order,
      });

      if (response?.status === true) {
       

        console.log("Fetched Posts:", response);
        setServices(response.data?.data || []);
        setTotalCount(response?.data?.pagination?.total || 0);
        setTotalPage(response?.data?.pagination?.totalPages || 1);
      } else {
        customToast.error("Error Fetching Posts", response?.message);
      }
    } catch (error) {
      customToast.error("An unexpected error occurred");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, per_page, searchText, Order]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" flex items-center justify-between mb-8">
        <div>
          <div className="text-lg font-semibold text-gray-900">Posts</div>
          <p className="text-sm text-gray-600">Manage all posts listings</p>
        </div>

        <Button
          onClick={() => {
            setIsOpen(true);
            setType("createPost");
          }}
          className="bg-black hover:bg-hoverMain text-white"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex flex-row justify-between gap-3 mb-4">
        <div className="relative  max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title..."
            className="pl-10 text-sm"
          />
        </div>
        <div>
          <Select value={Order} onValueChange={setOrder}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full shadow-none border-0  p-0">
        <CardContent className="space-y-4 p-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-black hover:bg-black ">
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Photo
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Title
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Content
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Tags
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Date
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services?.length > 0 ? (
                  services?.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell>
                        <img
                          src={post.featured_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNer1ZryNxWVXojlY9Hoyy1-4DVNAmn7lrg&s"}
                          alt={"not found"}
                          className="h-10 w-14 h-14 rounded-md object-cover mx-auto"
                          
                        />
                      </TableCell>
                      <TableCell className="font-medium truncate  text-gray-900">
                        {post.title.slice(0, 30)}...
                      </TableCell>
                      <TableCell className="text-gray-700 max-w-[200px] truncate">
                      {post.content.slice(0, 30)}...
                      </TableCell>
                      <TableCell className="text-gray-700">
                         <div className="flex flex-wrap gap-1 justify-center">
                            {post.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{tag}</span>
                            ))}
                            {post.tags?.length > 2 && <span className="text-xs">+{post.tags.length - 2}</span>}
                         </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-center">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
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
                              onClick={() => handleDelete(post._id)}
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className=" text-center py-3">
                        <div className="flex flex-col items-center justify-center space-y-3">
                        <PackageOpen className="h-12 w-12 text-zinc-200" />
                        <div className="space-y-1">
                            <p className="font-medium text-zinc-900">No posts found</p>
                            <p className="text-sm text-zinc-500">Try adjusting your search or add a new post.</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                            setType("createPost");
                            setIsOpen(true);
                            }}
                        >
                            Create Post
                        </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {services?.length > 0 && (
            <div className="flex justify-between items-center px-4 py-2 mt-2">
              <div className=" text-sm text-gray-500">
                {services?.length} of {totalCount} row(s)
              </div>
              <div className=" flex space-x-6 items-center">
                <div className=" flex items-center gap-4">
                  <div className=" text-sm text-gray-500">Rows per page</div>
                  <Select
                    value={per_page.toString()}
                    onValueChange={(val) => {
                        setPer_Page(val);
                        setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <CustomPagination
            currentPage={page}
            totalPages={totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </CardContent>
      </Card>

      <PostCreate
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
    </>
  );
}