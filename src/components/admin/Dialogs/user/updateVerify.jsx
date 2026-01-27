import { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Label } from "../../../ui/label";
import { Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { Input } from "../../../ui/input";
import { Switch } from "@/components/ui/switch";
 
import customToast from "../../../customToast";

export function UpdateVerify({
  isOpen,
  handleColse,
  onRefresh,
  handleSubmit,
  selectedUser,
}) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    isVerify: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, isVerify: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);


 

    const { start_date, end_date, isVerify } = formData;

    if (!start_date || !end_date || !isVerify) {
      customToast.error("Error", "Please fill all required fields!");
      setIsLoading(false);
      return;
    }

    try {
      await handleSubmit(selectedUser?.id , formData);
      customToast.success("Success", "Verification updated successfully!");
      onRefresh?.();
      handleColse();
    } catch (error) {
      console.error(error);
      customToast.error("Error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      <form onSubmit={handleUpdate}>
        <DialogContent className="w-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Update Verification</DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-1 space-y-5 mt-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Start Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="pl-12 h-12 text-base border-gray-200 rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                End Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="pl-12 h-12 text-base border-gray-200 rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Verify Status
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={formData.isVerify || false}
                  onCheckedChange={(value) =>
                    setFormData((prev) => ({ ...prev, isVerify: value }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="verified">Verified</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild />
            <Button
              type="submit"
              onClick={handleUpdate}
              className="w-full bg-main hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
