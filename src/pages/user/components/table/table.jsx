import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Search, Plus } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { UserDialog } from "../form";
import { UserService } from "../../../../services/UserService";
import UserCardSkeleton from "../loading";
import UserCard from "../card";
import { UpdatePasswordDialog } from "../update_password";

export function UserTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [type, setType] = useState("create");
  const [searchText, setSearchText] = useState("");
  const [loading, setIsLoading] = useState(false);
  // const [totalPage, setTotalPage] = useState(1);
  // const [order, setOrder] = useState("desc");

  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsOpen(false);
    setType("create");
    setPasswordOpen(false);
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await UserService().fetchAll({
        // order,
        // search: searchText,
      });
      if (response.data?.success) {
        setUsers(response.data?.data || []);
      }
    } catch (error) {
      customToast.error("Error Fetching Categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user) => {
    setIsOpen(true);
    setType("edit");

    setSelectedUser(user);
  };

  const handleOpenPasswordUpdate = (user) => {
    setPasswordOpen(true);
    setSelectedUser(user);
  };

  return (
    <div className=" mt-2 md:mt-0">
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

      <div className="flex flex-row justify-between gap-3 mb-4 mt-5">
        <div className="relative max-w-xs flex-1">
          {/* <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="pl-8 text-xs h-8"
          /> */}
        </div>
        <div>
          <Button
            onClick={() => {
              setType("create");
              // setSelectedCategory(null);
              setIsOpen(true);
            }}
            className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
          >
            <Plus className="w-4 h-4 mr-1" /> Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading ? (
          [...Array(9)].map((_, i) => <UserCardSkeleton key={i} />)
        ) : users?.length > 0 ? (
          users?.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              handleOpenEdit={handleOpenEdit}
              handleOpenPasswordUpdate={handleOpenPasswordUpdate}

              // onDelete={(targetOrder) => handleYourDeleteModal(targetOrder)}
              // onEdit={(orderId) => handleYourEditRedirect(orderId)}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center text-gray-400 text-sm bg-white border border-slate-100 rounded-xl">
            No orders found
          </div>
        )}
      </div>
      <UserDialog
        isOpen={isOpen}
        handleClose={handleCloseDialog}
        type={type}
        selectedUser={selectedUser}
        onRefresh={fetchUsers}
      />
      <UpdatePasswordDialog
        isOpen={passwordOpen}
        handleClose={handleCloseDialog}
        selectedUser={selectedUser}
        onRefresh={fetchUsers}
      />
    </div>
  );
}
