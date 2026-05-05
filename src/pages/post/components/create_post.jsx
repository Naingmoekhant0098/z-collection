import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { ProductVariantDialog } from "./create_varient";
import { ProductService } from "../../../services/PostService";
import { set } from "zod";
import { CategoryService } from "../../../services/BannerService";
import LoadingOverlay from "../../../components/Loading";
import customToast from "../../../components/customToast";

function CreateProduct() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const { create } = ProductService();
  const { fetchAll } = CategoryService();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
    variants: [],
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchAllCagory();
  }, []);

  const fetchAllCagory = async () => {
    try {
      const res = await fetchAll();
      setCategories(res?.data?.data || []);

      if (res.status) {
        console.log("Fetched Categories:", res.data);
      } else {
        console.error("Failed to fetch categories:", res.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addVariant = () => {
    setIsOpen(true);
  };

  const submitVariant = (variantData) => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...variantData, available_stock: variantData.stock }],
    }));
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
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
      // 2. Initialize FormData
      const data = new FormData();

      // 3. Append Simple Fields
      data.append("name", formData.name);
      data.append("category_id", formData.category);
      data.append("description", formData.description);
      data.append("is_active", "true");

     
      data.append("image", formData.image);

      // 5. Append Array (Must be stringified for FormData)
      data.append("variants", JSON.stringify(formData.variants));

      console.log("Submitting FormData to Backend...");

     
      const res = await create(data);
      console.log("Backend Response:", res);

      if (res?.data?.success) {
        customToast.success("Success", "Product created successfully!");
        setFormData({
          name: "",
          category: "",
          description: "",
          image: null,
          variants: [],
        });
        navigate("/admin/products");
      } else {
        customToast.error(
          "Creation Failed",
          res.message || "Error saving product."
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
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  return (
    <main className="flex-1 overflow-y-auto ">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProductVariantDialog
          isOpen={isOpen}
          type="create"
          handleClose={() => setIsOpen(!isOpen)}
          submitVariant={submitVariant}
        />
        {isLoading && <LoadingOverlay message="Creating Product..." />}
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
                <BreadcrumbPage>Create Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 rounded-lg border border-slate-300 gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Cancel</span>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Product
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-3 -mt-1"
        >
          <div className="lg:col-span-1 space-y-4">
            <div className="p-3 rounded-xl border border-slate-200 space-y-3  bg-transparent">
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
                    <div className="absolute z-40 inset-0 bg-black/40  group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                    <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                      Recommended: 4:5 Portrait
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

            <div className=" p-3 rounded-xl border border-grey-200  space-y-2">
              <h2 className="text-sm font-bold mb-2 uppercase  tracking-wider">
                General Info
              </h2>

              <div className="space-y-1">
                <label className="text-xs  uppercase font-semibold text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Soft Granite Dress"
                  className="w-full mt-1 p-2.5 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full mt-1 p-2.5 py-2 text-xs  border rounded-lg focus:ring-2 focus:ring-pink-200  transition-all  outline-none"
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
                <label className="text-xs  uppercase font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the product..."
                  className="w-full mt-1 p-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-2">
            <div className=" p-3 rounded-xl border border-slate-200  space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold  uppercase  tracking-wider">
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
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Buy Price</th>
                      <th className="px-4 py-3 text-right">Sell Price</th>
                      <th className="px-4 py-3 text-center">Est. Profit</th>
                      <th className="px-4 py-3 text-center"></th>
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
                              variant.stock < 5
                                ? "bg-red-50 text-red-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {variant.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-500">
                          {variant.buy_price ? `${variant.buy_price}K` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {variant.price ? `${variant.price}K` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {variant?.stock *
                            (variant?.price - variant?.buy_price)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {formData.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Note: Prices are entered in thousands (e.g., 40 = 40,000 MMK)
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateProduct;
