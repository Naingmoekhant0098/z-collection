import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

import { useEffect, useState } from "react";

import { UserDialog } from "../form";
import { UserService } from "../../../../services/UserService";
import UserCardSkeleton from "../loading";
import UserCard from "../card";
import { UpdatePasswordDialog } from "../update_password";
import customToast from "../../../../components/customToast";
import { Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import CustomPagination from "../../../../components/pagination/pagination";

export function CustomerTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [type, setType] = useState("create");
  const [searchText, setSearchText] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
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

      const service = UserService();

      const response = await service.fetchAllCustomers({
        search: searchText,
        page,
      });
      

      if (response?.data?.success) {
        setUsers(response.data?.data?.customers || []);
        setTotalPage(response?.data?.data?.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
      customToast.error("Error Fetching Users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText,page]);

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
            <BreadcrumbPage>Customers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-row justify-between gap-3 mb-4 mt-4">
        <div className="relative md:max-w-xs flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="pl-10 text-xs  rounded-2xl h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
        {loading ? (
          [...Array(9)].map((_, i) => <UserCardSkeleton key={i} />)
        ) : users?.length > 0 ? (
          users?.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              handleOpenEdit={handleOpenEdit}
              handleOpenPasswordUpdate={handleOpenPasswordUpdate}
              refresh ={fetchUsers}
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
       <div className="mt-6">
              <CustomPagination
                currentPage={page}
                totalPages={totalPage}
                onPageChange={setPage}
              />
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
