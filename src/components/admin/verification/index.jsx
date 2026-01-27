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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import { format } from "date-fns"
import { Calendar as CalendarIcon, ListFilter } from "lucide-react"
 
import { cn } from "@/lib/utils"
 
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 

import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { UserCreate } from "../Dialogs/user/User";
import { UserDetail } from "../Dialogs/user/UserDetail";
import { Input } from "../../ui/input";
import { VerificationDetail } from "../Dialogs/verification";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Verified",
    verified: true,
    points: 1200,
    checkInDate: "2024-08-01",
    expireDate: "2025-08-01",
    avatar: "/professional-headshot.png",
    
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Manager",
    status: "Pending",
    verified: false,
    points: 800,
    checkInDate: "2024-09-01",
    expireDate: "2025-09-01",
    avatar: "/professional-woman-headshot.png",
    
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "User",
    status: "Unverified",
    verified: false,
    points: 500,
    checkInDate: "2024-07-10",
    expireDate: "2025-07-10",
    avatar: "/professional-man-headshot.png",
  
    lastActive: "1 week ago",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    status: "Verified",
    verified: true,
    points: 1350,
    checkInDate: "2024-09-01",
    expireDate: "2025-09-01",
    avatar: "/professional-woman-headshot-2.png",
     
    lastActive: "5 minutes ago",
  },
];

export function VerificationTable() {
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Unverified":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-[#00A98B]/10 text-[#00A98B] hover:bg-[#00A98B]/20";
      case "Manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "User":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const [checkInDate, setCheckInDate] = useState();
  const [expireDate, setExpireDate] = useState();
const [searchText,setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [userss, setUserss] = useState([...users]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [type, setType] = useState("");

  const handleSubmit = async (payload) => {
    if (type === "createUser") {
      const data = {
        ...payload,
        id: users.length + 1,
        avatar: "/professional-woman-headshot-2.png",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: "just now",
      };
      setUserss([...userss, data]);
    } else {
      setUserss(
        userss.map((us) => (us.id === payload.id ? { ...us, ...payload } : us))
      );
    }
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handleFilter = async()=>{
    
const filteredUsers = users.filter((user) => {
    const matchesSearch =
        !searchText ||
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesCheckIn =
        !checkInDate ||
        user.checkInDate === format(checkInDate, "yyyy-MM-dd");
    const matchesExpire =
        !expireDate ||
        user.expireDate === format(expireDate, "yyyy-MM-dd");
    return matchesSearch && matchesCheckIn && matchesExpire;
});
setUserss(filteredUsers);
  }
  const handleUpdateStatus = (id, verified) => {
    setUserss(
      userss.map((user) =>
        user.id === id ? { ...user, verified, status: verified ? "Verified" : "Unverified" } : user
      )
    );
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, verified, status: verified ? "Verified" : "Unverified" });
    }
  }

  return (
    <Card className="w-full border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            User Management
          </CardTitle>
          <p className="text-[14px] text-gray-600 mt-1">
            Manage your team members and their permissions
          </p>
        </div>
       
      </CardHeader>

      

      
      <CardContent className="space-y-4 pt-0">
        <div className=" flex gap-3 items-center">
          <Input value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder="Search services..." className="w-[250px]" />
          <Popover  >
      <PopoverTrigger  asChild>
        <Button
          variant="outline"
          data-empty={!checkInDate}
          className="data-[empty=true]:text-muted-foreground w-[250px] mt-0 justify-start text-left font-normal"
        >
          <CalendarIcon />
          {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} />
      </PopoverContent>
    </Popover>
    <Popover  >
      <PopoverTrigger  asChild>
        <Button
          variant="outline"
          data-empty={!expireDate}
          className="data-[empty=true]:text-muted-foreground w-[250px] mt-0 justify-start text-left font-normal"
        >
          <CalendarIcon />
          {expireDate ? format(expireDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={expireDate} onSelect={setExpireDate} />
      </PopoverContent>
    </Popover>
          <Button
          onClick={handleFilter}
          className="bg-main hover:bg-[#00A98B]/90 text-white"
        >
          <ListFilter className="mr-2 h-4 w-4" />
           Filter
        </Button>
          
        </div>
        <div className="rounded-lg border overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Expire</TableHead>
                
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userss.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-[#00A98B]/10 text-[#00A98B] text-xs font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {user.name}
                          </p>
                          {user.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-gray-600 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  

                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-700 text-sm">{user.points}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{user.checkInDate}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{user.expireDate}</TableCell>
                  
                  <TableCell className="text-gray-600 text-sm">{user.lastActive}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className=" "
                          onClick={() => {
                            setSelectedUser(user);
                            setIsOpenDetail(true);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                         {
                            !user?.verified ? (<DropdownMenuItem
                                className=" text-green-500"
                                  onClick={() => {
                                    handleUpdateStatus(user.id, true);
                                  }}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                  Verified
                                </DropdownMenuItem>) : (
                                    <DropdownMenuItem
                                    className=" text-red-500"
                                    onClick={() => {
                                        handleUpdateStatus(user.id, false);
                                      }}
                                    >
                                      <CheckCircle className="mr-1 h-4 w-4 text-red-500" />
                                      Unverified
                                    </DropdownMenuItem>
                                )
                         }
                         
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      

      <VerificationDetail
        user={selectedUser}
        isOpen={isOpenDetail}
        handleClose={() => {
          setSelectedUser(null);
          setIsOpenDetail(false);
        }}
      />
    </Card>
  );
}
