import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Save,
  ShoppingBag,
  Check,
  ChevronsUpDown,
  Minus,
  Plus,
} from "lucide-react";

// Shadcn UI Components (Assuming standard paths)
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";

import customToast from "../../../components/customToast";
import { ProductService } from "../../../services/PostService";
import { Input } from "../../../components/ui/input";
import { OrderService } from "../../../services/OrderService";
import LoadingOverlay from "../../../components/Loading";

function CreateOrder() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    total_amount: 0,
    items: [],
    payment_method: "cash",
    payment_status: "",
    royal_order_number: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      const res = await ProductService().fetchAll({ page: 1, limit: 100 });
      if (res?.data?.success) setAllProducts(res.data.data.products || []);
    };
    loadProducts();
  }, []);

  const handleAddVariant = (variant) => {
    const exists = formData.items.find((i) => i.variant_id === variant._id);
    if (exists) return customToast.error("Already added to order");

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: selectedProduct._id,
          product_name: selectedProduct.name,
          variant_id: variant._id,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          quantity: 1,
        },
      ],
    }));
    customToast.success("Added to list");
  };

  const updateQty = (index, delta) => {
    const newItems = [...formData.items];
    const newQty = newItems[index].quantity + delta;
    if (newQty > 0) {
      newItems[index].quantity = newQty;
      setFormData({ ...formData, items: newItems });
    }
  };

  const totalAmount = formData.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  useEffect(() => {
    setFormData((prev) => ({ ...prev, total_amount: totalAmount }));
  }, [totalAmount]);

  const handleSaveOrder = async (e) => {
    e?.preventDefault?.();

    console.log(formData);
    if (
      !formData?.name ||
      !formData?.phone ||
      !formData?.address ||
      !formData?.city
    ) {
      customToast.error(
        "Missing Customer Info",
        "Please fill all customer details."
      );
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      customToast.error("No Items", "Please add at least one product.");
      return;
    }

    if (!formData.payment_method) {
      customToast.error(
        "Missing Payment Method",
        "Please select a payment method."
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        customer: {
          name: formData?.name,
          phone: formData?.phone,
        },
        address: formData?.address,
        city: formData?.city,
        items: formData.items,
        total_amount: formData.total_amount,
        payment_method: formData.payment_method,
        status: formData.status || "pending",
        payment_status: formData.payment_status || "unpaid",
        royal_order_number: formData?.royal_order_number,
      };

      const res = await OrderService().createTwo(payload);

      if (res?.data?.success) {
        customToast.success("Success", "Order saved successfully!");

        setFormData({
          customer: {
            name: "",
            phone: "",
            address: "",
            city: "",
          },
          items: [],
          total_amount: 0,
          payment_method: "",
          status: "pending",
          payment_status: "unpaid",
          royal_order_number: "",
        });

        navigate("/admin/orders");
      } else {
        customToast.error("Save Failed", res?.message || "Error saving order.");
      }
    } catch (error) {
      console.error("Order Save Error:", error);
      customToast.error("Server Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Order</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {isLoading && <LoadingOverlay message="Creating Order..." />}

          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 rounded-lg border border-slate-300 gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Cancel</span>
            </div>
            <button
              onClick={handleSaveOrder}
              className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 -mt-1">
          <div className="lg:col-span-1 space-y-4">
            <div className="p-3 rounded-xl border border-slate-300 space-y-2 bg-transparent">
              <h2 className="text-sm font-bold mb-2 uppercase tracking-wider text-slate-900">
                Customer Info
              </h2>
              <div className=" pt-3 mt-1 border-t border-slate-200 space-y-2">
                <div className="space-y-1">
                  <label className="text-xs  uppercase font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full mt-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="e.g. Juan Weber"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full mt-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="09..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full mt-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-slate-700">
                    Address
                  </label>
                  <textarea
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows="4"
                    className="w-full mt-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Shipping address..."
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-300 space-y-3 ">
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Select Product
              </h2>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-xs h-10 border-slate-300 rounded-lg font-normal"
                  >
                    {selectedProduct
                      ? selectedProduct.name
                      : "Search inventory..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search product name..."
                      className="h-9 text-xs"
                    />
                    <CommandList>
                      <CommandEmpty className="text-xs p-4 text-center text-slate-500">
                        No product found.
                      </CommandEmpty>
                      <CommandGroup>
                        {allProducts.map((product) => (
                          <CommandItem
                            key={product._id}
                            value={product.name}
                            onSelect={() => {
                              setSelectedProduct(product);
                              setOpen(false);
                            }}
                            className="text-xs py-2 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-3 w-3",
                                selectedProduct?._id === product._id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {selectedProduct && (
              <div className="p-3 rounded-xl border border-slate-300 space-y-3  animate-in fade-in slide-in-from-top-1">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Choose Variants
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 pt-3 mt-1 border-t border-slate-300 gap-2">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => handleAddVariant(v)}
                      className="p-2 hover:bg-gray-50 active:bg-gray-100/70 border flex justify-between items-center border-slate-300 rounded-lg hover:border-slate-900 text-left transition-all group "
                    >
                      <div>
                        <p className="text-[10px] font-bold  uppercase tracking-tighter mb-1">
                          {v.size} / {v.color}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          {v.stock} items in stock
                        </p>
                      </div>
                      <p className="text-xs font-medium text-slate-900 mt-0.5">
                        {v.price}Ks
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 rounded-xl border border-slate-300 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-900" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Order items
                  </h2>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {formData.items.length > 0 ? (
                  formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="group relative  rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
                    >
                      <div className="flex gap-2">
                        <div className="relative shrink-0">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                            }
                            className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100"
                            alt={item.name}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px]   font-semibold px-1.5 py-0.5 rounded uppercase  ">
                                  {item.size}/ {item.color}
                                </span>
                                <p className="text-[9px] text-slate-500 font-medium">
                                  {item.price}Ks / unit
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm  font-semibold text-slate-900">
                                {(item.price * item.quantity).toLocaleString()}
                                Ks
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-slate-100/50 rounded-lg p-0.5 border border-slate-200/60">
                              <button
                                onClick={() => updateQty(index, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-[11px] font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(index, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  items: formData.items.filter(
                                    (_, i) => i !== index
                                  ),
                                })
                              }
                              className="flex items-center gap-1.5 text-[10px] font-semibold text-red-600 hover:text-rose-500 transition-colors uppercase tracking-wider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-2xl">
                    <div className="p-3 bg-slate-50 rounded-full mb-3">
                      <ShoppingBag className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      Your order manifest is empty.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-300 space-y-2 bg-transparent">
              <h2 className="text-sm font-bold mb-2 uppercase tracking-wider text-slate-900">
                Payment Info
              </h2>

              <div className="space-y-1 pt-2 mt-2 border-t border-slate-300">
                <label className="text-xs  uppercase font-semibold text-slate-700">
                  Royal Order Number
                </label>
                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      royal_order_number: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  placeholder="e.g. R0000000"
                />
              </div>

              <div className="  space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Payment Method
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_method: value })
                  }
                  value={formData.payment_method}
                  defaultValue="cash"
                >
                  <SelectTrigger className="w-full mt-1 h-9 text-xs border  border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" className="text-xs">
                      Cash on Delivery
                    </SelectItem>
                    <SelectItem value="kpay" className="text-xs">
                      KPay
                    </SelectItem>
                    <SelectItem value="wave" className="text-xs">
                      Wave Pay
                    </SelectItem>
                    <SelectItem value="banking" className="text-xs">
                      Mobile Banking
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Payment Status
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_status: value })
                  }
                  defaultValue="pending"
                >
                  <SelectTrigger className="w-full mt-1 h-9 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" className="text-xs">
                      Pending
                    </SelectItem>
                    <SelectItem value="paid" className="text-xs">
                      Paid
                    </SelectItem>
                    <SelectItem value="partially_paid" className="text-xs">
                      Partially Paid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 ">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                Order Summary
              </h2>

              <div className=" pt-4   border-t border-slate-300 space-y-3">
                <div className="flex justify-between items-start text-[11px]">
                  <span className="text-slate-400 uppercase   font-medium  tracking-tight">
                    Customer
                  </span>
                  <span className="text-slate-900 font-semibold text-right truncate max-w-[150px]">
                    {formData.name || "Not entered"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Contact
                  </span>
                  <span className="text-slate-900 font-semibold text-right">
                    {formData.phone || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-start text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Ship To
                  </span>
                  <span className="text-slate-900 font-semibold text-right truncate max-w-[150px] leading-tight">
                    {formData.address || "No address provided"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Royal Number
                  </span>
                  <span className=" capitalize  font-medium ">
                    {formData?.royal_order_number || "Not entered"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Payment Method
                  </span>
                  <span className=" capitalize  font-medium ">
                    {formData.payment_method || "Not entered"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Payment Status
                  </span>
                  <span className=" capitalize  font-medium ">
                    {formData.payment_status || "Not entered"}
                  </span>
                </div>

                {/* Financials */}
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Subtotal
                  </span>
                  <span className="text-slate-700  font-bold ">
                    {totalAmount.toLocaleString()}K
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 uppercase  font-medium  tracking-tight">
                    Service Fee
                  </span>
                  <span className="text-green-600  font-medium ">Free</span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-900 border-dashed">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                      Total Payable
                    </span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900 tracking-tighter">
                    {totalAmount.toLocaleString()}K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateOrder;
