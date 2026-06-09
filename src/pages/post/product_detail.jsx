import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import {
  ArrowLeft,
  Package,
  DollarSign,
  PieChart,
  Layers,
  Trash,
  Trash2,
  Edit,
  Edit2,
} from "lucide-react";
import { ProductService } from "../../services/PostService";
import { Button } from "../../components/ui/button";
import { DeleteAccountConfirmation } from "../../components/admin/Dialogs/deleteAccount";
import customToast from "../../components/customToast";

function ProductDetail() {
  const { id } = useParams();
  const [product, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteShow,setIsDeleteShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const res = await ProductService().getById(id);
      if (res.data?.success) {
        setData(res.data?.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await ProductService().deleteById(id);
      if (res.data?.success) {
        customToast.success("Product Deleted Successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  if (loading) {
    return (
      <div className="p-8 text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
        Loading Document...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-xs font-mono text-red-500 uppercase tracking-widest">
        Document Not Found.
      </div>
    );
  }

  const variants = product.variants || [];

  const totalInitialStock = variants.reduce(
    (acc, v) => acc + (v.initial_stock || 0),
    0
  );
  const totalRemainingStock = variants.reduce(
    (acc, v) => acc + (v.remaining_stock || 0),
    0
  );
 
  return (
    <main className="flex-1 mt-10 md:mt-0 overflow-y-auto    min-h-screen">
      <div className=" flex items-center justify-between mb-4 md:mb-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 pl-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className=" flex items-center gap-2">
          <DeleteAccountConfirmation isOpen={isDeleteShow}  data={product} handleClose={()=>setIsDeleteShow(false)} handleDelete={handleDelete}/>
          <Button onClick={() => setIsDeleteShow(true)} variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 />
          </Button>
          <Button variant="outline" onClick={()=> navigate(`/admin/products/edit/${id}`)} className="text-indigo-600 hover:text-indigo-700">
            <Edit2 />
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto  lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6 lg:sticky ">
          <div className=" border border-slate-200/80 p-2 rounded-sm shadow-sm">
            <div className="aspect-[4/2] w-full bg-slate-50 overflow-hidden">
              <img
                src={
                  product.image ||
                  "https://cdn.shopify.com/s/files/1/0070/7032/articles/Clothing-Photography_1ce4a4bc-0651-43df-8260-f6d8f01628f4.jpg?v=1747247930"
                }
                alt={product.name}
                className="w-full h-full object-cover filter grayscale-[10%] contrast-[105%]"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                Product Name
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                {product.name}
              </h1>
            </div>

            <div className="">
              {/* <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Specifications / Notes</span> */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1 md:mt-0">
                {product.description || "No internal logs written."}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4   divide-x divide-slate-200 bg-white py-4 shadow-xs">
            <StatBlock
              icon={<Layers className="w-3.5 h-3.5 text-slate-400" />}
              label="Category"
              value={product.category_id?.name || "Unassigned"}
            />
            <StatBlock
              icon={<DollarSign className="w-3.5 h-3.5 text-slate-400" />}
              label="Total Cost (အရင်း)"
              value={`${product.total_cost?.toLocaleString()} MMK`}
            />
            <StatBlock
              icon={<Package className="w-3.5 h-3.5 text-slate-400" />}
              label="Remaining Units"
              value={`${totalRemainingStock} / ${totalInitialStock} Pcs`}
            />
            <StatBlock
              icon={<PieChart className="w-3.5 h-3.5 text-slate-400" />}
              label="Operational Status"
              value={product.is_active ? "Operational" : "Deactivated"}
              isStatus
              isActive={product.is_active}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                Variant Stock Ledger
              </h2>
            </div>

            <div className=" overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-mono whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Variant Specification</th>
                      <th className="px-5 py-3 text-right">Initial Stock</th>
                      <th className="px-5 py-3 text-right">Remaining Stock</th>
                      <th className="px-5 py-3 text-right">Sold Units</th>
                      <th className="px-5 py-3 text-right text-slate-900">
                        Unit Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.map((variant) => {
                      const soldVariantQty =
                        (variant.initial_stock || 0) -
                        (variant.remaining_stock || 0);
                      const isLowStock = (variant.remaining_stock || 0) < 15;

                      return (
                        <tr
                          key={variant._id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900">
                              {variant.size}
                            </span>
                            <span className="text-slate-400 mx-2">/</span>
                            <span className="text-slate-600">
                              {variant.color}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-500">
                            {variant.initial_stock}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={`font-semibold ${
                                isLowStock
                                  ? "text-amber-600 font-bold"
                                  : "text-slate-900"
                              }`}
                            >
                              {variant.remaining_stock} {isLowStock && "⚠️"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-indigo-600 font-medium">
                            {soldVariantQty > 0 ? `+${soldVariantQty}` : "0"}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                            {variant.price?.toLocaleString()} MMK
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-end text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            <span>
              Doc_Created:{" "}
              {product.created_at
                ? new Date(product.created_at).toLocaleDateString()
                : "-"}
            </span>
            <span>
              Doc_Updated:{" "}
              {product.updated_at
                ? new Date(product.updated_at).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

// Flat Stat Block Sub-component
function StatBlock({ icon, label, value, isStatus, isActive }) {
  return (
    <div className="px-6 py-2 flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </span>
      {isStatus ? (
        <span
          className={`text-[10px] font-bold tracking-wider uppercase mt-0.5 ${
            isActive ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          ● {value}
        </span>
      ) : (
        <span className="text-sm font-semibold tracking-tight text-slate-800 mt-0.5">
          {value}
        </span>
      )}
    </div>
  );
}

export default ProductDetail;
