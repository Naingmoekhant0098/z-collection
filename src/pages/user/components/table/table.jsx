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
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  PackageOpen,
  UserCircle,
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

import { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { cn } from "@/lib/utils";
import CustomPagination from "../../../../components/pagination/pagination";

export function UserTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [type, setType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState("desc");

  // User Data
  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      date: "2024-03-01",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "Editor",
      status: "Inactive",
      date: "2024-03-05",
    },
  ];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-lg font-semibold text-gray-900">Users</div>
          <p className="text-sm text-gray-600">Manage all user accounts</p>
        </div>

        <Button
          onClick={() => {
            setIsOpen(true);
            setType("createUser");
          }}
          className="bg-black hover:bg-hoverMain text-white"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex flex-row justify-between gap-3 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="pl-10 text-sm"
          />
        </div>
        <div>
          <Select value={order} onValueChange={setOrder}>
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

      <Card className="w-full shadow-none border-0 p-0">
        <CardContent className="space-y-4 p-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-black hover:bg-black">
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    User
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Name
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Email
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Role
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] border-r border-gray-500 text-center">
                    Joined Date
                  </TableHead>
                  <TableHead className="text-white p-4 font-medium text-[14px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sampleData?.length > 0 ? (
                  sampleData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <UserCircle className="h-10 w-10 text-gray-300" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 text-center">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-700 text-center">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="px-2 py-1 rounded bg-slate-100 text-xs font-medium">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 text-center">
                        {user.date}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <PackageOpen className="h-12 w-12 text-zinc-200" />
                        <p className="font-medium text-zinc-900">
                          No users found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <CustomPagination
            currentPage={page}
            totalPages={totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </CardContent>
      </Card>
    </>
  );
}
