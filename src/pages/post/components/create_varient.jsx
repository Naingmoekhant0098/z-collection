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
  Trash,
  Plus,
} from "lucide-react";
import customToast from "../../../components/customToast/index";

export function ProductVariantDialog({
  isOpen,
  handleClose,
  type = "create",
  variantData,
  submitVariant,
}) {
  const [formData, setFormData] = useState({
    size: "",
    color: "",
    initial_stock: "",
    remaining_stock: "",
    price: "",
    initial_price: "",
    wholesale_prices: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState({ min_qty: "", price: "" });

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && variantData) {
        const currentStock =
          variantData.remaining_stock ?? variantData.initial_stock ?? "";
        setFormData({
          size: variantData.size || "",
          color: variantData.color || "",
          price: variantData.price || "",
          initial_stock: variantData.initial_stock ?? currentStock,
          remaining_stock: currentStock,
          initial_price: variantData.initial_price || "",
          wholesale_prices: variantData.wholesale_prices || [],
        });
      } else {
        setFormData({
          size: "",
          color: "",
          initial_stock: "",
          remaining_stock: "",
          price: "",
          initial_price: "",
          wholesale_prices: [],
        });
      }
    }
  }, [variantData, isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (type === "create" && name === "remaining_stock") {
        updatedData.initial_stock = value;
      }
      return updatedData;
    });
  };

  const addTier = () => {
    if (!tier.min_qty || !tier.price) {
      customToast.error("Fill tier info");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      wholesale_prices: [
        ...prev.wholesale_prices,
        { min_qty: Number(tier.min_qty), price: Number(tier.price) },
      ],
    }));
    setTier({ min_qty: "", price: "" });
  };

  const removeTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      wholesale_prices: prev.wholesale_prices.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.size ||
      !formData.color ||
      formData.price === "" ||
      formData.remaining_stock === "" ||
      formData.initial_price === "" ||
      formData.wholesale_prices.length === 0
    ) {
      customToast.error(
        "Missing Info",
        "Please fill in all details and add at least one wholesale tier."
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      initial_stock: Number(formData.initial_stock),
      remaining_stock: Number(formData.remaining_stock),
      initial_price: Number(formData.initial_price),
      wholesale_prices: formData.wholesale_prices,
    };

    submitVariant(payload);
    setIsLoading(false);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSave}>
          <DialogHeader className=" p-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/10 rounded-full">
                {type === "edit" ? (
                  <Edit3 className="w-4 h-4 text-black" />
                ) : (
                  <Shirt className="w-4 h-4" />
                )}
              </div>
              <DialogTitle className="text-md font-medium text-black">
                {type === "edit" ? "Update Variant" : "New Variant"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-4 space-y-5 bg-white">
            {/* Size & Color Grid */}
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
                    <SelectTrigger className="pl-10 w-48 h-11 border-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                    <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
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
                    placeholder="Red..."
                    value={formData.color}
                    onChange={handleInputChange}
                    className="pl-10 h-10 border-slate-200 rounded-xl text-sm"
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
                  placeholder="Eg : 12"
                  type="number"
                  value={formData.remaining_stock}
                  onChange={handleInputChange}
                  className="pl-10 h-10 border-slate-200 text-xs rounded-xl"
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
                  placeholder="Eg : 17000"
                  type="number"
                  value={formData.initial_price}
                  onChange={handleInputChange}
                  className="pl-10 h-10 text-sm border-slate-200 rounded-xl"
                />
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
                  placeholder="Eg : 12000"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-10 h-10 text-sm border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] uppercase font-bold text-slate-500 ml-1">
                Wholesale Pricing
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Qty"
                  value={tier.min_qty}
                  onChange={(e) =>
                    setTier((p) => ({ ...p, min_qty: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={tier.price}
                  onChange={(e) =>
                    setTier((p) => ({ ...p, price: e.target.value }))
                  }
                />
                <Button type="button" onClick={addTier}>
                  <Plus />
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.wholesale_prices.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs bg-slate-50 p-2 rounded"
                  >
                    <span>
                      {t.min_qty}+ → {t.price} MMK
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      className="text-red-500"
                    >
                      <Trash  className=" size-5"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="h-11 rounded-xl"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main text-white h-11 text-xs! rounded-xl"
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
