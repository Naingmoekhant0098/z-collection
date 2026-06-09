import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Layers, Box, ArrowUpRight } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Updated to calculate using remaining_stock first, falling back to initial_stock
  const totalStock =
    product.variants?.reduce((sum, variant) => {
      return sum + (variant.remaining_stock ?? variant.initial_stock ?? 0);
    }, 0) ?? 0;

  return (
    <div
      onClick={() => navigate(`/admin/products/${product?._id}`)}
      className="bg-white p-3.5 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer group flex flex-col justify-between min-h-[140px] md:min-h-0"
    >
      <div>
        {/* Main Content Layout: Row on Mobile, Column on Desktop */}
        <div className="flex flex-row md:flex-col gap-3 items-start w-full">
          
          {/* Product Image Wrapper */}
          <div className="relative flex-shrink-0 w-20 h-20 md:w-full md:h-40 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Package className="h-6 w-6 text-slate-300" />
            )}
            
            {/* Quick Action visual indicator on hover (Desktop only) */}
            <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block border border-slate-100 shadow-sm">
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>

          {/* Text & Meta Information Block */}
          <div className="flex flex-col gap-1 w-full min-w-0 md:mt-1">
            <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-pink-600 transition-colors">
              {product.name}
            </h3>

            {/* Categorization & Pricing Row */}
            <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between md:gap-2 mt-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-500 truncate">
                <span className="text-slate-400 font-medium">Cat:</span>{" "}
                {product.category_id?.name || "General"}
              </div>

              <div className="text-[10px] uppercase font-bold text-slate-700">
                <span className="text-slate-400 font-medium">Cost:</span>{" "}
                {product.total_cost ? `${product.total_cost} K` : "0 MMK"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Meta Section */}
      <div className="flex w-full items-center justify-between gap-2 border-t pt-2.5 mt-3 border-slate-100 text-slate-500 text-[11px]">
        {/* Stock Status Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Box
            className={`h-3.5 w-3.5 flex-shrink-0 ${
              totalStock === 0 ? "text-red-400" : totalStock < 5 ? "text-amber-500" : "text-slate-400"
            }`}
          />
          <span
            className={`font-semibold truncate ${
              totalStock === 0 ? "text-red-500" : totalStock < 5 ? "text-amber-600" : "text-slate-600"
            }`}
          >
            {totalStock === 0
              ? "Out of Stock"
              : totalStock < 5
              ? `Low Stock (${totalStock})`
              : `${totalStock} Available`}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 text-slate-400 font-medium">
          <Layers className="h-3.5 w-3.5" />
          <span>{product.variants?.length || 0} Varients</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;