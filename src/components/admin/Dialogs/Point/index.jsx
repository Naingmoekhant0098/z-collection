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
import { Loader2, DollarSign, Tag } from "lucide-react";
import customToast from "../../../customToast";

export function PointEdit({
  isOpen,
  handleClose,
  handleSubmit,
  type,
  selectedPost,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Prefill form if editing existing data
  useEffect(() => {
    if (selectedPost) {
      setFormData({ ...selectedPost });
    } else {
      setFormData({});
    }
  }, [selectedPost]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save with async logic
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData?.point || !formData?.fee) {
      customToast.error("Error", "Please fill all required fields!");
      return;
    }

    try {
      setIsLoading(true);

      // Wait for parent submit handler to finish (e.g. API call)
      await handleSubmit(formData);

      // Optionally close dialog or reset form
      // handleClose();
      // setFormData({});
      // customToast.success("Success", "Point updated successfully!");
    } catch (error) {
      console.error(error);
      customToast.error("Error", "Something went wrong while saving!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {selectedPost ? "Edit Point" : "Add Point"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-1 space-y-4">
          {/* Point Field */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Point
            </Label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                name="point"
                type="text"
                placeholder="e.g. 1 point"
                value={formData?.point || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 h-12 text-base border-gray-200 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Fee Field */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Fee
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                name="fee"
                type="number"
                placeholder="e.g. 1500"
                value={formData?.fee || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 h-12 text-base border-gray-200 rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 mt-3">
          <DialogClose asChild />
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-main hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>Update Point</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
