import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { ArrowLeft, Plus, Trash2, Edit3, Save, Banknote } from "lucide-react";
import { ProductVariantDialog } from "./create_varient";
import { ProductService } from "../../../services/PostService";
import { CategoryService } from "../../../services/BannerService";
import LoadingOverlay from "../../../components/Loading";
import customToast from "../../../components/customToast";
import { Input } from "../../../components/ui/input";
import { UserService } from "../../../services/UserService";
import { Switch } from "../../../components/ui/switch";

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [selectedVariantData, setSelectedVariantData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [users, setUsers] = useState([]);
  const { create, updateByIdPut, getById } = ProductService();
  const { fetchAll } = CategoryService();
  const { fetchAll: fetchUsers } = UserService();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
    is_has_partner: false,
    partner_id: null,
    total_cost: 0,
    variants: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!formData.is_has_partner) {
      setFormData((prev) => ({
        ...prev,
        partner_id: null,
      }));
    }
  }, [formData.is_has_partner]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllUsers();
    if (isEdit) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchAllCategories = async () => {
    try {
      const res = await fetchAll();
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getById(id);
      if (res?.data?.success || res?.status) {
        const product = res.data.data;
        const mappedVariants = (product.variants || []).map((variant) => {
          const currentStock =
            variant.remaining_stock ??
            variant.initial_stock ??
            variant.stock ??
            0;
          return {
            ...variant,
            initial_stock: variant.initial_stock ?? currentStock,
            remaining_stock: currentStock,
          };
        });

        setFormData({
          name: product.name || "",
          category: product.category_id || product.category || "",
          description: product.description || "",
          total_cost: product.total_cost || 0,
          image: product.image || null,
          variants: mappedVariants,
          is_has_partner: product.is_has_partner || false,
          partner_id: product.partner_id || null,
        });

        if (product.image) {
          setPreviewImage(product.image);
        }
      } else {
        customToast.error("Failed to load product details", res.message);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      customToast.error("Server Error", "Could not load data for editing.");
    } finally {
      setIsLoading(false);
    }
  };

  const addVariant = () => {
    setDialogMode("create");
    setEditingVariantIndex(null);
    setSelectedVariantData(null);
    setIsOpen(true);
  };

  const editVariant = (index) => {
    setDialogMode("edit");
    setEditingVariantIndex(index);
    setSelectedVariantData(formData.variants[index]);
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setEditingVariantIndex(null);
    setSelectedVariantData(null);
  };

  const submitVariant = (variantData) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];

      const normalized = {
        ...variantData,
        initial_stock: variantData.remaining_stock,
        remaining_stock: variantData.remaining_stock,
        wholesale_prices: variantData.wholesale_prices || [],
      };

      if (dialogMode === "edit" && editingVariantIndex !== null) {
        updatedVariants[editingVariantIndex] = {
          ...updatedVariants[editingVariantIndex],
          ...normalized,
        };
      } else {
        updatedVariants.push(normalized);
      }

      return { ...prev, variants: updatedVariants };
    });

    handleDialogClose();
  };

  const getVariantEffectivePrice = (variant, qty = 1) => {
    if (!variant.wholesale_prices?.length) return variant.price || 0;

    const sorted = [...variant.wholesale_prices].sort(
      (a, b) => a.min_qty - b.min_qty
    );

    let price = variant.price;

    for (const tier of sorted) {
      if (qty >= tier.min_qty) {
        price = tier.price;
      }
    }

    return price;
  };

  const getVariantCost = (variant) => {
    const stock = variant.initial_stock || variant.remaining_stock || 1;
    return (formData.total_cost || 0) / stock;
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.description) {
      customToast.error(
        "Missing Information",
        "Please fill in general details."
      );
      return;
    }

    if (!formData.image) {
      customToast.error("Missing Image", "Please upload a product image.");
      return;
    }

    if (!formData.variants || formData.variants.length === 0) {
      customToast.error("No Variants", "Please add at least one variant.");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category_id", formData.category?._id || formData.category);
      data.append("description", formData.description);
      data.append("total_cost", formData.total_cost);
      data.append("is_active", "true");
      data.append("variants", JSON.stringify(formData.variants));
      if (formData.is_has_partner && formData.partner_id) {
        data.append("is_has_partner", "true");
        data.append("partner_id", formData.partner_id);
      }
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      let res;
      if (isEdit) {
        res = await updateByIdPut(id, data);
      } else {
        res = await create(data);
      }
      if (res?.data?.success) {
        customToast.success(
          "Success",
          isEdit
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        navigate("/products");
      } else {
        customToast.error(
          isEdit ? "Update Failed" : "Creation Failed",
          res?.message || "Error saving product."
        );
      }
    } catch (error) {
      console.error("Submission Error:", error);
      customToast.error("Server Error", "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage(null);
  };
  return (
    <main className="flex-1 overflow-y-auto mt-14 md:mt-0 ">
      <div className=" mx-auto space-y-6">
        <ProductVariantDialog
          isOpen={isOpen}
          type={dialogMode}
          variantData={selectedVariantData}
          handleClose={handleDialogClose}
          submitVariant={submitVariant}
        />

        {isLoading && (
          <LoadingOverlay
            message={isEdit ? "Updating Product..." : "Creating Product..."}
          />
        )}

        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isEdit ? "Edit Product" : "Create Product"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate(-1)}
              className="flex items-center px-2.5 py-2.5 rounded-lg border bg-white border-slate-300 gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-3 -mt-1"
        >
          <div className="lg:col-span-1 space-y-4 bg-white p-4 rounded-2xl">
            <div className=" rounded-xl   space-y-3 bg-transparent">
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Product Image
              </h2>
              <div className="relative">
                {formData.image ? (
                  <div className="relative group h-[140px] rounded-xl overflow-hidden border border-slate-100">
                    <img
                      src={previewImage}
                      className="w-full h-full object-cover"
                      alt="Product preview"
                    />
                    <div className="absolute z-40 inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-pink-300 transition-all group">
                    <div className="p-3 bg-slate-50 rounded-full group-hover:bg-pink-50 transition-colors">
                      <Plus className="w-6 h-6 text-slate-400 group-hover:text-pink-500" />
                    </div>
                    <span className="text-xs text-slate-500 mt-3 font-semibold">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className=" pt-4 border-t space-y-2">
              <h2 className="text-sm font-bold mb-2 uppercase tracking-wider">
                General Info
              </h2>
              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="e.g. Soft Granite Dress"
                  className="w-full mt-1 p-2.5 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs mb-5! uppercase font-semibold text-slate-700 ">
                  Cost(အရင်း)
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    name="total_cost"
                    type="number"
                    placeholder="e.g. 45"
                    value={formData.total_cost}
                    onChange={handleChange}
                    className="pl-10 h-10 text-sm border-slate-200 rounded-xl focus-visible:ring-pink-200 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    .000 K
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 my-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="partner-switch"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Partner Product
                    </label>
                    <p className="text-xs text-slate-500">
                      Share this product with a partner.
                    </p>
                  </div>

                  <Switch
                    id="partner-switch"
                    checked={formData.is_has_partner}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        is_has_partner: checked,
                      })
                    }
                  />
                </div>
              </div>
              {formData?.is_has_partner && (
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-slate-700">
                    Partner
                  </label>
                  <select
                    name="partner_id"
                    value={formData.partner_id}
                    className="w-full mt-1 p-2.5 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                    onChange={handleChange}
                  >
                    <option value="">Select Partner</option>
                    {users?.length > 0 &&
                      users
                        ?.filter((user) => user.role != "admin")
                        ?.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                  </select>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  className="w-full mt-1 p-2.5 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 transition-all outline-none"
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories?.length > 0 &&
                    categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  placeholder="Describe the product..."
                  className="w-full mt-1 p-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <div className=" p-3 rounded-xl border bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Pricing & Variants
                </h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-xs font-medium text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD VARIANT
                </button>
              </div>

              <div className="border rounded-lg overflow-auto border-slate-200 ">
                <table className="w-full text-sm text-left">
                  <thead className="bg-pink-100 text-pink-900 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Color</th>
                      {/* Updates the table header visually depending on mode */}
                      <th className="px-4 py-3">
                        {isEdit ? "Stock (Remaining)" : "Stock"}
                      </th>
                      <th className="px-4 py-3 text-right">Sell Price</th>
                      <th className="px-4 py-3 text-center">Est. Profit</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {formData.variants.map((variant, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {variant.size || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {variant.color || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              (variant.remaining_stock ??
                                variant.initial_stock ??
                                0) < 5
                                ? "bg-red-50 text-red-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {variant.remaining_stock ??
                              variant.initial_stock ??
                              0}{" "}
                            Stocks
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {variant.price ? `${variant.price}K` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {(() => {
                            const stock =
                              variant.remaining_stock ??
                              variant.initial_stock ??
                              0;

                            const sellPrice = getVariantEffectivePrice(
                              variant,
                              1
                            );
                            const cost = getVariantCost(variant);

                            const profit = (sellPrice - cost) * stock;

                            return `${profit.toFixed(0)} MMK`;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => editVariant(index)}
                              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {formData.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProductForm;
