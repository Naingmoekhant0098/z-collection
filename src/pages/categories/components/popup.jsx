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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Tag,
  Link2,
  AlignLeft,
  Layers,
  Edit3,
  Plus, // Import Plus icon
} from "lucide-react";
import customToast from "../../../components/customToast";
import { CategoryService } from "../../../services/CategoryService";

export function CategoryDialog({
  isOpen,
  handleClose,
  type = "create", // "create" or "edit"
  selectedCategory,
  onRefresh,
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory && type === "edit") {
      setFormData({
        name: selectedCategory.name || "",

        description: selectedCategory.description || "",
        is_active: selectedCategory.is_active ?? true,
      });
    } else {
      setFormData({
        name: "",

        description: "",
        is_active: true,
      });
    }
  }, [selectedCategory, isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      customToast.error("Required Fields", "Name and Slug are required.");
      return;
    }
    setIsLoading(true);
    try {
      const res =
        type === "edit"
          ? await CategoryService().updateById(selectedCategory._id, formData)
          : await CategoryService().createTwo(formData);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Operation failed");
      }
      customToast.success(
        "Success",
        `Category ${type === "edit" ? "updated" : "created"} successfully`
      );
      onRefresh();
      handleClose();
    } catch (error) {
      customToast.error("Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSave}>
          <DialogHeader className="bg-main p-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/10 rounded-full">
                {type === "edit" ? (
                  <Edit3 className="w-4 h-4" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
              </div>
              <DialogTitle className="text-lg font-medium">
                {type === "edit" ? "Edit Category" : "New Category"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 bg-white">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Name
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  name="name"
                  placeholder="e.g. Casual Wear"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-11 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Description
              </Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
                <Textarea
                  placeholder="Type your description here."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="pl-10 min-h-[100px] border-slate-200 rounded-xl text-sm  focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl   ">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700">
                  Active Status
                </span>
                <span className="text-[10px] text-slate-500">
                  Visible to customers
                </span>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="h-11 rounded-xl text-slate-500 font-medium px-6"
            >
              Cancel
            </Button>

            {/* Dynamic Button UI */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main hover:opacity-90 text-white h-11 px-8 font-semibold rounded-xl shadow-lg transition-all"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : type === "edit" ? (
                <>Update Category</>
              ) : (
                <>Add Category</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
