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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserCreate } from "../Dialogs/user/User";
import { UserDetail } from "../Dialogs/user/UserDetail";
import { Input } from "../../ui/input";

import customToast from "../../customToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { CustomLists } from "../customCardlist";
import { UpdateVerify } from "../Dialogs/user/updateVerify";

export function UserTable() {
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 2:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 0:
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

  const getVerifiedColor = (verified) => {
    return verified
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
      : "bg-red-100 text-red-800 hover:bg-red-200";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  // const [userss, setUserss] = useState([...users]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [Order, setOrder] = useState("desc");
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState(0);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    verified_users: 0,
    active_users: 0,
  });

  const metrics = [
    {
      title: "Total Users",
      value: dashboardData?.total_users,

      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: dashboardData?.active_users,

      icon: UserCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Verified Users",
      value: dashboardData?.verified_users,

      icon: UserX,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const payload = {
        order_by: Order,
        search: searchText,
        isDeleted: 0,
      };
      const response = await UserService.fetchUsers(payload);
      console.log(response)
      if (!response?.status || response?.statusCode !== 200) {
        customToast.error(
          "Error Fetching Users",
          response?.message || "Something went wrong"
        );
        return;
      }

      setUsers(response.data || []);
      console.log(response);
      setDashboardData(response.dashboardData);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      customToast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, Order, status]);


  const handleVerifyUser = (user) => {
    // Directly toggle verification
    if (user.isVerify) {
      // If user is already verified, unverify immediately
      handleUpdateUser(user.id, {
        start_date: null,
        end_date: null,
        isVerify: 0,
      });
    } else {
      // Open dialog to set start/end dates before verifying
      setSelectedUser(user);
      setIsVerifyDialogOpen(true);
    }
  };
  
  const handleUpdateUser = async (userId, payload) => {
    try {
      const response = await UserService.updateUser(userId, payload);
  
      if (!response?.status || response.statusCode !== 200) {
        customToast.error(
          "Error Updating User",
          response?.message || "Something went wrong"
        );
        return;
      }
  
      fetchUsers(); // Refresh user list
      customToast.success("Success", "User Updated Successfully");
    } catch (error) {
      console.error("Error Updating User:", error);
      customToast.error("An unexpected error occurred");
    } finally {
      setIsVerifyDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const response = await UserService.deleteUser(id);
      if (!response?.status || response?.statusCode != 200) {
        customToast.error("Error Deleting User", response?.message);
      }
      if (response?.status && response?.statusCode === 200) {
        // fetchUsers();
        customToast.success("Success", response?.message);
      }
    } catch (error) {}
    // setUserss(users.filter((ut) => ut.id !== id));
  };

  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

 

  return (
    <>
      <div>
        <CustomLists data={metrics} />
      </div>
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

        <CardContent>
          <div className=" flex gap-3 items-center justify-between mb-4">
            <div className=" flex gap-2 items-center">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search user..."
                className="w-[250px]"
              />
              <Select value={Order} onValueChange={(value) => setOrder(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">ASC</SelectItem>
                  <SelectItem value="desc">DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                setIsOpen(true);
                setType("createUser");
              }}
              className="bg-main hover:bg-[#00A98B]/90 text-white"
            >
              <Plus /> Add User
            </Button>
          </div>
          <div className="rounded-lg border overflow-hidden p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Verifiy Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Created Date</TableHead>
                  {/* <TableHead>Last Active</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.length > 0 ? users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-[#00A98B]/10 text-[#00A98B] text-xs font-medium">
                            {user.first_name}
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
                      <Badge
                        variant="secondary"
                        className={getRoleColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        // className={getRoleColor(user.role)}
                      >
                        {Number(user?.purchased_points)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getVerifiedColor(user.isVerify)}
                      >
                        {user.isVerify ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {user?.start_date
                        ? new Date(user?.start_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {user?.end_date
                        ? new Date(user?.end_date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-gray-600 text-sm">
                      {new Date(user?.created_at).toLocaleDateString()}
                    </TableCell>

                    {/* <TableCell className="text-gray-600 text-sm">
                    {user.lastActive}
                  </TableCell> */}

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              handleVerifyUser(user);
                            }}
                            className="cursor-pointer "
                          >
                            {user?.isVerify ? (
                              <div className=" flex items-center gap-2 text-green-400">
                                <UserCheck className="mr-2 text-green-400 hover:text-green-400 h-4 w-4" />
                                Verified
                              </div>
                            ) : (
                              <div className=" flex items-center gap-2 text-red-400">
                                <UserCheck className="mr-2 text-red-400 hover:text-red-400 h-4 w-4" />
                                Unverified
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsOpenDetail(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setIsOpen(true);
                              setType("editUser");
                              setSelectedUser(user);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user?.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableCell colSpan={8} className=" text-center py-3">
                  There is no data yet! please create one
                </TableCell>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <UserCreate
          isOpen={isOpen}
          type={type}
          handleColse={() => {
            setSelectedUser(null);
            setIsOpen(false);
            setType(null);
          }}
          onRefresh={fetchUsers}
          selectedUser={selectedUser}
        />
        <UpdateVerify
          isOpen={isVerifyDialogOpen}
          handleSubmit={handleUpdateUser}
          handleColse={() => {
            setSelectedUser(null);
            setIsVerifyDialogOpen(false);
            setType(null);
          }}
          onRefresh={fetchUsers}
          selectedUser={selectedUser}
        />
        <UserDetail
          user={selectedUser}
          isOpen={isOpenDetail}
          handleClose={() => {
            setSelectedUser(null);
            setIsOpenDetail(false);
            setType(null);
          }}
        />
      </Card>
    </>
  );
}
