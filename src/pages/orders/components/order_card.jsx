// components/order_card.jsx
import React, { useState } from "react";
import { ShoppingBag, ChevronDown, Edit3, Trash2, Eye } from "lucide-react";
import { format, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { DeleteAccountConfirmation } from "../../../components/admin/Dialogs/deleteAccount";
import { OrderService } from "../../../services/OrderService";
export default function OrderCard({ order, isLoading, onEdit, onDelete }) {
  const [isDeleteShow, setIsDeleteShow] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await OrderService().deleteById(order?._id);
      if (res.data?.success) {
        customToast.success("Order Deleted Successfully");
        navigate("/admin/orders");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const navigate = useNavigate();
  if (isLoading || !order) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-100 animate-pulse h-[160px]" />
    );
  }
  const statusConfig = {
    pending: {
      label: "Pending",
      color: "text-amber-500 bg-amber-50/60 border-amber-100",
    },
    delivered: {
      label: "InProgress",
      color: "text-sky-500 bg-sky-50/60 border-sky-100",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-rose-400 bg-rose-50/60 border-rose-100",
    },
  };

  const normalizedStatus = order?.status?.toLowerCase() || "new";
  const badge = statusConfig[normalizedStatus] || statusConfig.new;

  const totalItems =
    order?.items?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;
  const displayAmount = order?.total_amount
    ? order.total_amount.toLocaleString()
    : "0";

  const orderSlug = order?.order_number?.includes("-")
    ? order.order_number.split("-")[1]
    : order?.order_number?.slice(-6) || "4237";

  const orderDate = order?.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = isValid(orderDate)
    ? format(orderDate, "MM/dd/yyyy")
    : "—";

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-[175px] text-slate-800">
      <DeleteAccountConfirmation
        isOpen={isDeleteShow}
        data={order}
        handleClose={() => setIsDeleteShow(false)}
        handleDelete={handleDelete}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-600 border border-amber-200/40">
            <ShoppingBag className="h-4 w-4 fill-amber-500/20" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-1.5 border-r border-b border-white rotate-45 transform -translate-y-[0.5px]" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-900 leading-tight">
              Order
            </h4>
            <p className="text-[11px] font-mono font-medium text-slate-400 mt-0.5 uppercase">
              ROYAL NO {order?.royal_order_number || orderSlug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>
      </div>
      <div className="my-1.5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {displayAmount}
          </span>
          <span className="text-xs font-bold text-slate-900 ml-1">Ks</span>
        </div>
        <div className="flex text-[11px]  items-center">
          <span>Number of items : </span>
          <span className="text-slate-700 font-semibold">{totalItems}</span>
        </div>
      </div>
      <div className="space-y-2.5 pt-2.5 border-t border-slate-100 text-[11px] font-medium text-slate-400">
        <div className="flex justify-between items-center">
          <span>Created:</span>
          <span className="text-slate-700 font-bold">{formattedDate}</span>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-50"
        >
          <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">
            Actions
          </span>

          <div className="flex items-center gap-1">
            {/* View Details Button */}
            <button
              type="button"
              title="View Details"
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Edit Order"
              onClick={() => {
                if (onEdit) onEdit(order._id);
                else navigate(`/admin/orders/edit/${order._id}`);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Delete Order"
              onClick={() => setIsDeleteShow(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
