import React, { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Calendar, Edit2, Lock, LockKeyhole, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { cn } from "@/lib/utils";
import { DeleteAccountConfirmation } from "../../../components/admin/Dialogs/deleteAccount";
import { UserService } from "../../../services/UserService";
import customToast from "../../../components/customToast";
function UserCard({ user, handleOpenEdit, handleOpenPasswordUpdate, refresh }) {
  const [isDeleteShow, setIsDeleteShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  //   const handleCloseDialog = () => {
  //     setIsOpen(false);
  //   };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteShow(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await UserService().deleteCustomer(user._id);
      if (res?.data?.success) {
        customToast.success("Customer Deleted Successfully");
        setIsDeleteShow(false);
        refresh?.();
      } else {
        customToast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      customToast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group bg-white p-5  rounded-3xl border border-slate-200 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
      <div className="">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)}
            </div>

            <span
              className={cn(
                "absolute -bottom-1 -right-0 mb-1 h-3 w-3 rounded-full border border-white",
                user?.status === "active" ? "bg-green-500" : "bg-red-500"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm truncate">{user?.name}</h3>

              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 capitalize! ${
                  user?.status == "active"
                    ? "border-green-500  text-green-500"
                    : "border-red-500 text-red-500"
                }`}
              >
                {user?.status}
              </Badge>
            </div>

            <p className="text-[11px] text-zinc-500 truncate mt-1">
              {user?.phone}
            </p>
            <div className=" flex   justify-between">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                <Calendar size={10} />
                {new Date(user?.created_at).toLocaleDateString("en-GB")}
              </div>

              <Button
                variant="outline"
                size="icon"
                className=" p-0 border-red-400 text-red-400 "
                onClick={handleDeleteClick}
              >
                <Trash2 size={10} className="" />
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="flex gap-2 mt-3 border-t pt-4 border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenPasswordUpdate(user)}
            className="flex-1 h-8 rounded-2xl text-xs"
          >
            <LockKeyhole size={12} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(user)}
           className="flex-1 h-8 rounded-2xl text-xs"
          >
            <Edit2 size={12} />
          </Button>

          <Button
            variant="outline"
            size="sm"
           className="flex-1 h-8 rounded-2xl text-xs"
          >
            <Trash2 size={12} />
          </Button>
        </div> */}
      </div>

      <DeleteAccountConfirmation
        isOpen={isDeleteShow}
        data={user}
        loading={isDeleting}
        handleClose={() => setIsDeleteShow(false)}
        handleDelete={handleDelete}
      />

      {/* <UserDialog
        isOpen={isOpen}
        handleClose={handleCloseDialog}
        type="edit"
        selectedCategory={user}
        // onRefresh={fetchCategories}
      /> */}
    </div>
  );
}

export default UserCard;
