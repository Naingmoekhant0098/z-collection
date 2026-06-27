import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
 
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

function ProductDetail() {
  const { id } = useParams();
  const [product, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRevenue , setTotalRevenue] = useState(0);

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
        setTotalRevenue(res.data?.data?.salesStats?.totalRevenue)
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
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

  const totalSoldUnits = variants.reduce((acc, v) => {
    return acc + ((v.initial_stock || 0) - (v.remaining_stock || 0));
  }, 0);

 

  const totalSellingRevenueByProductCount = variants.reduce((acc, v) => {
    const sold = (v.initial_stock || 0) - (v.remaining_stock || 0)
    const variantRevenue = sold * (v.initial_price || 0);
    return acc + variantRevenue;
  }, 0);

  const totalCost = product.total_cost || 0;

  const profit = totalRevenue - totalCost;
  const ProfitByProduct =totalRevenue -totalSellingRevenueByProductCount ;

  return (
    <main className="flex-1 mt-14 md:mt-0 overflow-y-auto min-h-screen">
      <div className="flex items-center justify-between mb-4 md:mb-0">
        <div
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky">
          <div className="border border-slate-200/80  overflow-hidden rounded-xl">
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

          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
              Product Name
            </span>

            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {product.name}
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              {product.description || "No internal logs written."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 md:space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 bg-white py-4 border border-slate-200 rounded-2xl overflow-hidden">
            <StatBlock
              icon={<Layers className="w-3.5 h-3.5 text-slate-400" />}
              label="Category"
              value={product.category_id?.name || "Unassigned"}
            />

            <StatBlock
              icon={<DollarSign className="w-3.5 h-3.5 text-slate-400" />}
              label="Total Cost (အရင်း)"
              value={`${totalCost.toLocaleString()} MMK`}
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
            <StatBlock
              icon={<DollarSign className="w-3.5 h-3.5 text-slate-400" />}
              label="Revenue"
              value={`${totalRevenue.toLocaleString()} MMK`}
            />

            <StatBlock
              icon={<PieChart className="w-3.5 h-3.5 text-slate-400" />}
              label="Net Profit"
              value={`${profit.toLocaleString()} MMK`}
              isStatus
              isActive={profit >= 0}
            />

            <StatBlock
              icon={<PieChart className="w-3.5 h-3.5 text-slate-400" />}
              label="Profit By Selling Product"
              value={`${ProfitByProduct.toLocaleString()} MMK`}
              isStatus
              isActive={profit >= 0}
            />

            
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {variants.map((variant) => {
              const initial = variant.initial_stock || 0;
              const remaining = variant.remaining_stock || 0;
              const sold = Math.max(initial - remaining, 0);

              const price = variant.price || 0;
              const costPrice = variant.initial_price || 0;
              const cost = initial * costPrice;
              const profit = initial * price - initial * initial;
              return (
                <div
                  key={variant._id}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                      {variant.size}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {variant.size} · {variant.color}
                      </p>

                      <div className="flex gap-3 mt-0.5 text-[11px] text-slate-500">
                        <span className="">
                          Stock : <span className=" text-green-400">{initial} </span>
                        </span>
                        <span>
                          Remainig : <span className=" text-orange-400">{remaining} </span>
                        </span>
                        <span>Sold : <span className=" text-blue-400">{sold} </span></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 leading-tight">
                    <p className="text-sm font-semibold text-slate-900">
                      {variant.price.toLocaleString()}MMK
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Initial Price  {costPrice.toLocaleString()}MMK
                    </p>

                    {/* <p
                      className={`text-[11px] font-medium ${
                        profit >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      Profit {profit.toLocaleString()}
                    </p> */}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 justify-end text-[10px] font-mono text-slate-400 uppercase">
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

function StatBlock({ icon, label, value, isStatus, isActive }) {
  return (
    <div className="px-6 py-2 flex flex-col gap-1 rounded-2xl">
      <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </span>

      {isStatus ? (
        <span
          className={`text-[10px] font-medium uppercase ${
            isActive ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          ● {value}
        </span>
      ) : (
        <span className="text-sm font-semibold text-slate-800">{value}</span>
      )}
    </div>
  );
}

export default ProductDetail;
