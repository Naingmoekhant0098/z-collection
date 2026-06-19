import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  User,
  Mail,
  UserPlus,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Edit,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import customToast from "../../../components/customToast";
import { UserService } from "../../../services/UserService";

export function UserDialog({
  isOpen,
  handleClose,
  type = "create",
  selectedUser,
  onRefresh,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "partner",
    status: "active",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedUser && type === "edit") {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "",
        role: selectedUser.role || "partner",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "partner",
         
      });
    }
  }, [selectedUser, isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      customToast.error("Required Fields", "Name and Email are required.");
      return;
    }

    if (type === "create" && !formData.password) {
      customToast.error("Required Fields", "Password is required.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = { ...formData };

      if (type === "edit" && !payload.password) {
        delete payload.password;
      }
      const res =
        type === "edit"
          ? await UserService().updateByIdPut(selectedUser._id, payload)
          : await UserService().createTwo(payload);

      if (!res?.data?.success) {
        throw new Error(res?.data?.message);
      }

      customToast.success(
        "Success",
        `User ${type === "edit" ? "updated" : "created"} successfully`
      );

      onRefresh?.();
      handleClose?.();
    } catch (error) {
      customToast.error("Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSave}>
           
          <DialogHeader className=" p-6 py-4 ">
            <div className="flex items-center gap-3  border-b pb-3">
            <div className="p-2 rounded-full bg-gray-200 ">
                {type === "edit" ? (
                  <Edit className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </div>

              <DialogTitle className="text-md font-medium">
                {type === "edit" ? "Edit User" : "Create User"}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-5 bg-white">
            <div>
              <Label className="text-[11px] uppercase font-bold text-slate-500">
                Full Name
              </Label>

              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Enter Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px] uppercase font-bold text-slate-500">
                Email
              </Label>

              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Enter Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>
           {
            type !="edit" &&  <div>
            <Label className="text-[11px] uppercase font-bold text-slate-500">
              Password
            </Label>

            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={
                  type === "edit"
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                className="pl-10 pr-10 h-11 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
           }
            <div className=" w-full!">
              <Label className="text-[11px] uppercase font-bold text-slate-500">
                Role
              </Label>

              <Select
              
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
              >
                <SelectTrigger className="h-11 rounded-xl mt-1">
                  <Shield className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-2 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="h-11 rounded-xl text-slate-500 px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main hover:opacity-90 text-white h-11 px-8 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : type === "edit" ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}