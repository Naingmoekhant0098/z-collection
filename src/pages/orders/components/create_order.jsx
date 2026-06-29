import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { OrderService } from "../../../services/OrderService";
import LoadingOverlay from "../../../components/Loading";

function CreateOrEditOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    total_amount: 0,
    items: [],
    payment_method: "cash",
    payment_status: "unpaid",
    platform: "tiktok",
    royal_order_number: "",
    status: "pending",
  });

  useEffect(() => {
    const loadProducts = async () => {
      const res = await ProductService().fetchAll({ page: 1, limit: 100 });
      if (res?.data?.success) setAllProducts(res.data.data.products || []);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchOrderDetails = async () => {
      setIsFetchingOrder(true);
      try {
        const res = await OrderService().getById(id);
        if (res?.data?.success) {
          const order = res.data.data;
          setFormData({
            name: order?.customer_id?.name || "",
            phone: order?.customer_id?.phone || "",
            address: order?.address || "",
            city: order?.city || "",
            total_amount: order?.total_amount || 0,
            payment_method: order?.payment_method || "cash",
            payment_status: order?.payment_status || "unpaid",
            status: order?.status || "pending",
            royal_order_number: order?.royal_order_number || "",
            items: (order?.items || []).map((item) => ({
              product_id: item.product_id,
              name: item.name,
              image: item.image,
              variant_id: item.variant_id,
              size: item.size,
              color: item.color,
              price: item.price,
              quantity: item.quantity,
              // Fallback dynamically bounds stock constraint boundaries
              max_stock: item.max_stock || item.quantity + 20,
            })),
          });
        } else {
          customToast.error("Error", "Could not load order information.");
        }
      } catch (error) {
        console.error("Fetch Order Details Error:", error);
        customToast.error("Server Error", "Failed to retrieve order metadata.");
      } finally {
        setIsFetchingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [id, isEditMode]);

  const getEffectivePrice = (item, qty) => {
    // Always use the persistent original_price as the starting point
    const basePrice = item.price;
    console.log("Bse price is", basePrice);

    if (!item.wholesale_prices || item.wholesale_prices.length === 0) {
      return basePrice;
    }

    // Sort tiers so we can find the best deal
    const sorted = [...item.wholesale_prices].sort(
      (a, b) => b.min_qty - a.min_qty
    );

    // Find the first tier where qty meets the requirement
    const matchedTier = sorted.find((tier) => qty >= tier.min_qty);
    console.log(matchedTier);

    // If match found, use it; if not, return the original base price
    return matchedTier ? matchedTier.price : basePrice;
  };

  //   const getEffectivePrice = (item, qty) => {

  //   const basePrice = item.price;

  //   if (!item.wholesale_prices || item.wholesale_prices.length === 0) {
  //     return basePrice;
  //   }
  //   const sorted = [...item.wholesale_prices].sort((a, b) => b.min_qty - a.min_qty);
  //   const activeTier = sorted.find(tier => qty >= tier.min_qty);
  //   return activeTier ? activeTier.price : basePrice;
  // };

  const handleAddVariant = (variant) => {
    const exists = formData.items.find((i) => i.variant_id === variant._id);
    if (exists) return customToast.error("Already added to order");

    const maxStock = variant.remaining_stock ?? 0;
    if (maxStock <= 0)
      return customToast.error("This variant is completely out of stock");

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: selectedProduct._id,
          name: selectedProduct.name,
          image: selectedProduct.image,
          variant_id: variant._id,
          size: variant.size,
          color: variant.color,
          initial_price: variant.initial_price,
          price: variant.price,
          wholesale_prices: variant.wholesale_prices || [],
          quantity: 1,
          max_stock: maxStock,
        },
      ],
    }));
    customToast.success("Added to list");
  };

  // const updateQty = (index, delta) => {
  //   const newItems = [...formData.items];
  //   const targetItem = newItems[index];
  //   const newQty = targetItem.quantity + delta;

  //   if (delta > 0 && newQty > targetItem.max_stock) {
  //     customToast.error(
  //       "Stock Limit Reached",
  //       `Only ${targetItem.max_stock} units available.`
  //     );
  //     return;
  //   }

  //   if (newQty > 0) {
  //     newItems[index].quantity = newQty;
  //     setFormData({ ...formData, items: newItems });
  //   }
  // };
  const updateQty = (index, delta) => {
    const newItems = [...formData.items];
    const item = newItems[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) return;
    if (newQty > item.max_stock) {
      customToast.error("Stock Limit", `Only ${item.max_stock} available`);
      return;
    }

    item.quantity = newQty;

    // Calculate based on the static original_price,
    // then update the dynamic display price

    console.log(getEffectivePrice(item, newQty));
    item.price = getEffectivePrice(item, newQty);

    setFormData({ ...formData, items: newItems });
  };
  const totalAmount = formData.items.reduce((sum, i) => {
    const price = getEffectivePrice(i, i.quantity);
    return sum + price * i.quantity;
  }, 0);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, total_amount: totalAmount }));
  }, [totalAmount]);

  const handleSaveOrder = async (e) => {
    e?.preventDefault?.();

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
    for (const item of formData.items) {
      if (item.quantity > item.max_stock) {
        customToast.error(
          "Invalid Order Quantity",
          `${item.name} (${item.size}/${item.color}) exceeds available stock.`
        );
        return;
      }
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

      let res;
      if (isEditMode) {
        res = await OrderService().updateById(id, payload);
      } else {
        // Standard create execution pipeline
        res = await OrderService().createTwo(payload);
      }

      if (res?.data?.success) {
        customToast.success(
          "Success",
          isEditMode
            ? "Order updated successfully!"
            : "Order saved successfully!"
        );

        setFormData({
          name: "",
          phone: "",
          address: "",
          city: "",
          items: [],
          total_amount: 0,
          payment_method: "",
          status: "",
          payment_status: "",
          royal_order_number: "",
        });
        setSelectedProduct(null);
        navigate("/orders");
      } else {
        customToast.error(
          "Save Failed",
          res?.message || "Error processing your request."
        );
      }
    } catch (error) {
      console.error("Order Action Submission Error:", error);
      customToast.error("Server Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto mt-14 md:mt-0 ">
      <div className="max-w-auto mx-auto space-y-6">
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
                <BreadcrumbPage>
                  {isEditMode ? "Edit Order" : "Create Order"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {isLoading && (
            <LoadingOverlay
              message={isEditMode ? "Updating Order..." : "Creating Order..."}
            />
          )}
          {isFetchingOrder && (
            <LoadingOverlay message="Fetching Order Details..." />
          )}

          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </div>

            <button
              onClick={handleSaveOrder}
              disabled={isFetchingOrder}
              className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg text-xs hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />{" "}
              {isEditMode ? "Update Order" : "Save Order"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mt-1">
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Customer Info
              </h2>
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Full Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="e.g. Juan Weber"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Phone
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="09..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    City
                  </label>
                  <input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows="3"
                    className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Shipping address..."
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Select Product
              </h2>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-xs h-10 border-slate-200 rounded-lg font-normal bg-slate-50/50 hover:bg-white transition-all"
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

          <div className="lg:col-span-2 space-y-4">
            {selectedProduct && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Choose Variants
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 pt-2 border-t border-slate-100 gap-2">
                  {selectedProduct.variants.map((v) => {
                    const isOutOfStock = (v.remaining_stock ?? 0) <= 0;

                    return (
                      <button
                        key={v._id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleAddVariant(v)}
                        className={`p-2 border flex justify-between items-center rounded-lg text-left transition-all group ${
                          isOutOfStock
                            ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                            : "hover:bg-gray-50 active:bg-gray-100/70 border-slate-200 hover:border-slate-900 cursor-pointer"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-1">
                          <p
                            className={`text-[10px] font-bold uppercase tracking-tighter mb-0.5 truncate ${
                              isOutOfStock
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {v.size} / {v.color}
                          </p>
                          <p
                            className={`text-[9px] font-medium ${
                              isOutOfStock
                                ? "text-red-500 font-semibold"
                                : "text-slate-500"
                            }`}
                          >
                            {isOutOfStock
                              ? "❌ Out of stock"
                              : `${v.remaining_stock} items`}
                          </p>
                        </div>
                        <p
                          className={`text-xs font-bold whitespace-nowrap ${
                            isOutOfStock ? "text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {v.price}Ks
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-800" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Order items
                  </h2>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {formData.items.length > 0 ? (
                  formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="group p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-xs transition-all"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="relative shrink-0">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                            }
                            className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100"
                            alt={item.name}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h3 className="text-xs font-bold text-slate-800 truncate tracking-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">
                                  Size: {item.size} / Color: {item.color}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  ({item.price} Ks/unit)
                                </span>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-bold text-slate-900">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                Ks
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center bg-slate-50 rounded-md p-0.5 border border-slate-100">
                              <button
                                type="button"
                                onClick={() => updateQty(index, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-7 text-center text-[11px] font-bold text-slate-700">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(index, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  items: formData.items.filter(
                                    (_, i) => i !== index
                                  ),
                                })
                              }
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="p-2.5 bg-slate-100 rounded-full mb-2">
                      <ShoppingBag className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      Your order manifest is empty.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Payment Info
              </h2>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Royal Order Number
                  </label>
                  <input
                    value={formData.royal_order_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        royal_order_number: e.target.value,
                      })
                    }
                    className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="e.g. R0000000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Platform
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value })
                    }
                    value={formData.platform}
                  >
                    <SelectTrigger className="w-full h-10 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiktok" className="text-xs">
                        Tiktok
                      </SelectItem>
                      <SelectItem value="viber" className="text-xs">
                        Viber
                      </SelectItem>
                      <SelectItem value="telegram" className="text-xs">
                        Telegram
                      </SelectItem>
                      <SelectItem value="facebook" className="text-xs">
                        Facebook
                      </SelectItem>
                      <SelectItem value="other" className="text-xs">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Payment Method
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_method: value })
                    }
                    value={formData.payment_method}
                  >
                    <SelectTrigger className="w-full h-10 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white transition-all">
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
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Payment Status
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_status: value })
                    }
                    value={formData.payment_status}
                  >
                    <SelectTrigger className="w-full h-10 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid" className="text-xs">
                        Paid
                      </SelectItem>
                      <SelectItem value="unpaid" className="text-xs">
                        Unpaid
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-600">
                    Order Status
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    value={formData.status}
                  >
                    <SelectTrigger className="w-full h-10 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending" className="text-xs">
                        Pending
                      </SelectItem>
                      <SelectItem value="delivered" className="text-xs">
                        Delivered
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-xs">
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Order Summary
              </h2>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 font-medium">Customer</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[180px]">
                    {formData.name || "Not entered"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Contact</span>
                  <span className="text-slate-800 font-semibold">
                    {formData.phone || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-400 font-medium">Ship To</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[180px] leading-tight text-right">
                    {formData.address
                      ? `${formData.city ? formData.city + ", " : ""}${
                          formData.address
                        }`
                      : "No address provided"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Royal Number
                  </span>
                  <span className="text-slate-800 font-semibold uppercase">
                    {formData.royal_order_number || "Not entered"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Payment Method
                  </span>
                  <span className="text-slate-800 font-semibold uppercase">
                    {formData.payment_method}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Payment Status
                  </span>
                  <span className="text-slate-800 font-semibold uppercase">
                    {formData.payment_status}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="text-slate-800 font-bold">
                    {totalAmount.toLocaleString()} Ks
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Service Fee
                  </span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>

                <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-900 border-dashed">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Payable
                  </span>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">
                    {totalAmount.toLocaleString()} Ks
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

export default CreateOrEditOrder;
