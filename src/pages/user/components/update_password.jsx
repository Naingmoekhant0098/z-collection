import React, { useState } from "react";
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
import { Loader2, Lock, Eye, EyeOff, KeyRound } from "lucide-react";

import customToast from "../../../components/customToast";
import { UserService } from "../../../services/UserService";

export function UpdatePasswordDialog({
  isOpen,
  handleClose,
  selectedUser,
  onRefresh,
}) {
  const [formData, setFormData] = useState({
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      password: "",
    });
    setShowPassword(false);
  };

  const handleDialogClose = () => {
    resetForm();
    handleClose?.();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.password.trim()) {
      customToast.error("Required Field", "Please enter a new password.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await UserService().updateByIdPut(selectedUser?._id, {
        password: formData.password,
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Failed to update password");
      }

      customToast.success("Success", "Password updated successfully");

      onRefresh?.();
      handleDialogClose();
    } catch (error) {
      customToast.error(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSave}>
          <DialogHeader className="  p-6 py-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 rounded-full bg-black/10">
                <KeyRound className="w-4 h-4" />
              </div>

              <DialogTitle className="text-md font-medium">
                Update Password
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-6 pt-0 bg-white">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500">
                New Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      password: e.target.value,
                    })
                  }
                  className="pl-10 pr-10 h-11 rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Enter a new password for this user.
              </p>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-2 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDialogClose}
              className="h-11 rounded-xl text-slate-500 px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main hover:opacity-90  font-medium text-sm text-white h-11 px-8 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
