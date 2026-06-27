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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Ruler,
  Palette,
  Package,
  Banknote,
  Edit3,
  Shirt,
} from "lucide-react";
import customToast from "../../../components/customToast/index";

export function ProductVariantDialog({
  isOpen,
  handleClose,
  type = "create",
  variantData, // Unified naming with the parent component
  submitVariant,
}) {
  const [formData, setFormData] = useState({
    size: "",
    color: "",
    initial_stock: "",
    remaining_stock: "",
    price: "",
    initial_price: "",
    wholesale_price: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync modal internal fields when open, changing modes, or loading an existing variant
  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && variantData) {
        // Safe mapping with cross-compatibility fallbacks (stock vs remaining_stock)
        const currentStock =
          variantData.remaining_stock ??
          variantData.initial_stock ??
          variantData.stock ??
          "";
        setFormData({
          size: variantData.size || "",
          color: variantData.color || "",
          price: variantData.price || "",
          initial_stock: variantData.initial_stock ?? currentStock,
          remaining_stock: currentStock,
          initial_price: variantData.initial_price,
          wholesale_price: variantData.wholesale_price,
        });
      } else {
        // Reset state clearly on dynamic clean creations
        setFormData({
          size: "",
          color: "",
          initial_stock: "",
          remaining_stock: "",
          price: "",
          initial_price: "",

          wholesale_price: "",
        });
      }
    }
  }, [variantData, isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Mirror values to initial_stock ONLY during new entries setup
      if (type === "create" && name === "remaining_stock") {
        updatedData.initial_stock = value;
      }
      return updatedData;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.size ||
      !formData.color ||
      formData.price === "" ||
      formData.remaining_stock === "" ||
      formData.initial_price == "" ||
      formData.wholesale_price == ""
    ) {
      customToast.error("Missing Info", "Please fill in all variant details.");
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      initial_stock: Number(formData.initial_stock || formData.remaining_stock),
      remaining_stock: Number(formData.remaining_stock),
      initial_price: Number(formData.initial_price),
      wholesale_price: Number(formData.wholesale_price),
    };

    submitVariant(payload);
    setIsLoading(false);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSave}>
          <DialogHeader className="bg-main p-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/10 rounded-full">
                {type === "edit" ? (
                  <Edit3 className="w-4 h-4 text-pink-400" />
                ) : (
                  <Shirt className="w-4 h-4 " />
                )}
              </div>
              <DialogTitle className="text-md font-medium">
                {type === "edit" ? "Update Variant" : "New Variant"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-4 space-y-5 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                  Size
                </Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                  <Select
                    value={formData.size}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, size: value }))
                    }
                  >
                    <SelectTrigger className="pl-10 h-11 border-slate-200 rounded-xl text-sm focus:ring-pink-200">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="XS">Extra S(XS)</SelectItem>
                      <SelectItem value="S">Small (S)</SelectItem>
                      <SelectItem value="M">Medium (M)</SelectItem>
                      <SelectItem value="L">Large (L)</SelectItem>
                      <SelectItem value="XL">Extra L (XL)</SelectItem>
                      <SelectItem value="XXL">Double XL (XXL)</SelectItem>
                      <SelectItem value="Free">Free Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                  Color
                </Label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    name="color"
                    placeholder="Red, Blue..."
                    value={formData.color}
                    onChange={handleInputChange}
                    className="pl-10 h-10 border-slate-200 rounded-xl text-sm focus-visible:ring-pink-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                {type === "edit" ? "Remaining Stock" : "Initial Stock"}
              </Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  name="remaining_stock"
                  type="number"
                  placeholder="Quantity in hand"
                  value={formData.remaining_stock}
                  onChange={handleInputChange}
                  className="pl-10 h-10 border-slate-200 text-sm rounded-xl focus-visible:ring-pink-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Initial Price (MMK)
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  name="initial_price"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.initial_price}
                  onChange={handleInputChange}
                  className="pl-10 h-10 text-sm border-slate-200 rounded-xl focus-visible:ring-pink-200 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  .000 Ks
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Sell Price (MMK)
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  name="price"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-10 h-10 text-sm border-slate-200 rounded-xl focus-visible:ring-pink-200 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  .000 Ks
                </span>
              </div>
            </div>

            

            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Wholesale Price (MMK)
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  name="wholesale_price"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.wholesale_price}
                  onChange={handleInputChange}
                  className="pl-10 h-10 text-sm border-slate-200 rounded-xl focus-visible:ring-pink-200 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  .000 Ks
                </span>
              </div>
            </div>

          
          </div>

          <DialogFooter className="p-6 pt-2 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className=" h-11 rounded-xl text-slate-500 font-medium"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className=" bg-main hover:bg-pink-600 text-white h-11 font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : type === "edit" ? (
                "Update Details"
              ) : (
                "Add Variant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
