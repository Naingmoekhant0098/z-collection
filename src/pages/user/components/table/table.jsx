import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Edit,
  Trash2,
  Search,
  PackageOpen,
  Calendar,
  Mail,
  Trash,
  Edit2,
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
import { Badge } from "../../../../components/ui/badge";

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

      {/* Filter and Search Section */}
      <div className="flex flex-row justify-between gap-3 mb-4 mt-5">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="pl-8 text-xs h-8"
          />
        </div>
        <div>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="text-xs">
                Newest First
              </SelectItem>
              <SelectItem value="asc" className="text-xs">
                Oldest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Container */}
      <div className="space-y-4">
        {sampleData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sampleData.map((user) => (
              <Card
                key={user.id}
                className="overflow-hidden border p-3 border-gray-200 shadow-sm flex flex-col justify-between max-w-sm"
              >
                <CardContent className="flex-1 px-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-sm flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0 ">
                        <div className=" flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {user.name} 
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          <p className="text-[11px] text-gray-500 font-medium">{user.role}</p>
                          </Badge>
                        </div>

                        <div className="flex text-xs items-center text-gray-600 gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>

                        <div className="flex text-xs items-center text-gray-600 gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="text-gray-500">
                            Joined {user.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide shrink-0",
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div>
                    <Trash></Trash>
                    <Edit2 />
                  </div>

                   
                </CardContent>

                 
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full py-8 border border-dashed">
            <CardContent className="flex flex-col items-center justify-center space-y-2">
              <PackageOpen className="h-10 w-10 text-zinc-300" />
              <p className="font-medium text-xs text-zinc-500">
                No users found
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination Section */}
        <CustomPagination
          currentPage={page}
          totalPages={totalPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </>
  );
}
