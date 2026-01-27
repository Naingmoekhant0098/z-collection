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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ChatCreate } from "../Dialogs/chat";
import { Link } from "react-router-dom";

const pre_posts = [
  {
    id: 1,
    name: "Startup Growth Strategy",
    description: "Consulting on scaling startups effectively",
    price: 1500,
    users: [
      {
        id: 1,
        name: "Shad CN",
        email: "shadcn@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 2,
        name: "Ava Johnson",
        email: "ava.johnson@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 3,
        name: "Liam Smith",
        email: "liam.smith@example.com",
        avatar: "https://github.com/shadcn.png",
      },
    ],
    image: "startup-growth.jpg",
    createdAt: "2024-08-15",
  },
  {
    id: 2,
    name: "React Server Components Training",
    description: "In-depth training on React Server Components",
    price: 500,
    users: [
      {
        id: 1,
        name: "Shad CN",
        email: "shadcn@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 2,
        name: "Ava Johnson",
        email: "ava.johnson@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 3,
        name: "Liam Smith",
        email: "liam.smith@example.com",
        avatar: "https://github.com/shadcn.png",
      },
    ],
    image: "react-training.png",
    createdAt: "2024-09-01",
  },
  {
    id: 3,
    name: "SaaS Marketing Consultation",
    description: "Tailored marketing strategies for SaaS products",
    price: 800,
    users: [
      {
        id: 1,
        name: "Shad CN",
        email: "shadcn@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 2,
        name: "Ava Johnson",
        email: "ava.johnson@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        id: 3,
        name: "Liam Smith",
        email: "liam.smith@example.com",
        avatar: "https://github.com/shadcn.png",
      },
    ],
    image: "saas-marketing.jpg",
    createdAt: "2024-09-10",
  },
];

export function ChatTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [posts, setPosts] = useState([...pre_posts]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [type, setType] = useState("");

  const handleSubmit = async (payload) => {


      const data = {
        ...payload,
        image: "startup-growth.jpg",
        id: posts.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPosts([...posts, data]);
    
    // if (type === "createPost") {
    //   const data = {
    //     ...payload,
    //     image: "startup-growth.jpg",
    //     id: posts.length + 1,
    //     createdAt: new Date().toISOString().split("T")[0],
    //   };
    //   setPosts([...posts, data]);
    // } else {
    //   setPosts(
    //     posts.map((post) =>
    //       post.id === payload?.id ? { ...post, ...payload } : post
    //     )
    //   );
    // }
    setIsOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (searchText === "") {
      setPosts(pre_posts);
    } else {
      setPosts(
        pre_posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchText.toLowerCase()) ||
            post.description.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText]);

  return (
    <Card className="w-full border-0 shadow-sm">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Chats
          </CardTitle>
          <p className="text-sm text-gray-600">Manage all chat listings</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className=" flex justify-between items-center">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search chats..."
            className="w-[250px] mb-3"
          />
          <Button
            onClick={() => {
              setIsOpen(true);
              setType("createPost");
            }}
            className="bg-main hover:bg-[#00A98B]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Chat
          </Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Group Name</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Description</TableHead>

                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium text-gray-900">
                    {post.name}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        {
                       post?.users?.map((user) => (
                        <Avatar key={user.id}>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                       )
                       )
                             
                        }
                   
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {post?.description?.length > 50
                      ? post?.description?.substring(0, 50) + "..."
                      : post?.description}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                       <Link to={'/admin/chats-list'}>
                       <DropdownMenuItem
                          onClick={() => {
                            setSelectedPost(post);
                            setIsOpenDetail(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem></Link>
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
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center px-4 py-2 mt-2">
          <div className=" text-sm text-gray-500">
            0 of 100 row(s) selected.
          </div>
          <div className=" flex space-x-6 items-center">
            <div className=" text-sm text-gray-500">Rows per page</div>
            <div className=" flex space-x-6 items-center">
              <div className=" text-sm text-gray-500">Page 1 of 10</div>
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
        </div>
      </CardContent>
      <ChatCreate
        isOpen={isOpen}
        type={type}
        handleColse={() => {
          setIsOpen(false);
          setSelectedPost(null);
        }}
        handleSubmit={handleSubmit}
        selectedPost={selectedPost}
      />

      
    </Card>
  );
}
