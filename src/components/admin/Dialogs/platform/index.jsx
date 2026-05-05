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
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  Tag,
  ToggleRight,
} from "lucide-react";
import customToast from "../../../customToast";

export function PlatformFeeCreate({
  isOpen,
  handleClose,
  handleSubmit,
  type,
  selectedFee,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...selectedFee });
  }, [selectedFee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData?.platform ||
      !formData?.platform_fee ||
      !formData?.platform_description
    ) {
      customToast.error("Error", "Please fill all required fields!");
      setIsLoading(false);
      return;
    }

    handleSubmit(formData);
    setFormData({});
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <form onSubmit={handleSave}>
        <DialogContent className=" flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {type === "edit" ? "Edit Platform Fee" : "Create Platform Fee"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-1 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Platform Name
              </Label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="platform"
                  type="text"
                  placeholder="e.g. Listing Fee, Monthly Subscription"
                  value={formData?.platform || ""}
                  onChange={handleInputChange}
                  className="pl-12 h-12 text-base border-gray-200 rounded-xl"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Platform Point
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="platform_fee"
                  type="number"
                  placeholder="e.g. 1,2"
                  value={formData?.platform_fee || ""}
                  onChange={handleInputChange}
                  className="pl-12 h-12 text-base border-gray-200 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2 pb-2">
              <Label className="text-sm font-semibold text-gray-900">
                Platform Description
              </Label>
              <div className="relative">
                <Textarea
                  name="platform_description"
                  type="number"
                  placeholder="Write Something"
                  value={formData?.platform_description || ""}
                  onChange={handleInputChange}
                  className=" text-base border-gray-200 rounded-xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 mt-4">
            <DialogClose asChild />
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-main hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Save Fee</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
