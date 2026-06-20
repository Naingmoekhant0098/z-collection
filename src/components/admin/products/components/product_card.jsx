import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Box,
  ArrowUpRight,
  Edit,
  Trash2,
  DollarSignIcon,
  Tag,
} from "lucide-react";

import { Button } from "../../../ui/button";
import { DeleteAccountConfirmation } from "../../Dialogs/deleteAccount";

import { ProductService } from "../../../../services/PostService";
import customToast from "../../../customToast";

function ProductCard({ product, refresh }) {
  const navigate = useNavigate();
  const [isDeleteShow, setIsDeleteShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalStock =
    product?.variants?.reduce((sum, variant) => {
      return sum + (variant.remaining_stock ?? variant.initial_stock ?? 0);
    }, 0) ?? 0;

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/products/edit/${product._id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteShow(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await ProductService().deleteById(product._id);

      if (res?.data?.success) {
        customToast.success("Product Deleted Successfully");
        setIsDeleteShow(false);
        refresh?.();
      } else {
        customToast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      customToast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={() => navigate(`/products/${product?._id}`)}
        className="bg-white p-5 border border-slate-200 rounded-3xl  hover:shadow-sm active:scale-[0.99] active:bg-white/15 transition-all cursor-pointer group flex flex-col justify-between  md:min-h-0"
      >
        <div>
          <div className="flex flex-row md:flex-col gap-3 items-start w-full">
            <div className="relative flex-shrink-0 w-20 h-20 md:w-full md:h-40 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
              {product?.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Package className="h-6 w-6 text-slate-300" />
              )}

              <div className="absolute top-0.5 right-1">
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium  backdrop-blur-sm ${
                    totalStock === 0
                      ? "bg-red-100/90 text-red-600"
                      : totalStock < 5
                      ? "bg-amber-100/90 text-amber-600"
                      : "bg-emerald-100/90 text-emerald-600"
                  }`}
                >
                  {totalStock === 0 ? "Out" : totalStock < 5 ? "Low" : "Stock"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0 md:mt-1">
              <h2 className="text-sm font-medium text-gray-700">
                {product?.name}
              </h2>

              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-2 mt-1.5">
                <div className="text-[11px] uppercase flex items-center gap-1.5 font-medium text-slate-600">
                  <Tag
                    className={`h-3.5 w-3.5 flex-shrink-0 ${
                      totalStock === 0
                        ? "text-red-400"
                        : totalStock < 5
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  />
                  {product?.category_id?.name || "General"}
                </div>

                <div className="text-[11px] uppercase flex items-center gap-1.5 font-medium text-slate-700">
                  <DollarSignIcon
                    className={`h-3.5 w-3.5 flex-shrink-0 ${
                      totalStock === 0
                        ? "text-red-400"
                        : totalStock < 5
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  />

                  {product?.total_cost ? `${product.total_cost} MMK` : "0 MMK"}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row  justify-center items-center gap-2 flex-shrink-0 ">
              <Button
                variant="outline"
                size="icon"
                className=" border-slate-300 shadow-none "
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className=" border-red-400 text-red-400 shadow-none "
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountConfirmation
        isOpen={isDeleteShow}
        data={product}
        loading={isDeleting}
        handleClose={() => setIsDeleteShow(false)}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default ProductCard;
