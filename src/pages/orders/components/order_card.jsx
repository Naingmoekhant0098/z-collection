// components/order_card.jsx
import { Package, Truck, Clock, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import OrderCardSkeleton from "./order_loading";

export default function OrderCard({ order, isLoading }) {
  const statusConfig = {
    paid: {
      label: "Awaiting Rider",
      color: "text-sky-600 bg-sky-50 border-sky-100",
      icon: <Truck className="h-3.5 w-3.5" />,
    },
    unpaid: {
      label: "Current Order",
      color: "text-violet-600 bg-violet-50 border-violet-100",
      icon: <Package className="h-3.5 w-3.5" />,
    },
  };

  const config = statusConfig[order.status] || statusConfig.unpaid;
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/orders/${order._id}`)}
      className="bg-white p-5 py-4 border-b rounded-xl border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100/70 transition-colors flex items-start gap-4 cursor-pointer"
    >
      <div
        className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border text-pink-600 bg-pink-50 border-pink-100`}
      >
        <Truck className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2.5 ">
            <h3 className="font-semibold text-slate-900 text-[14px] truncate leading-tight">
              {order.customer_id?.name.length > 12
                ? `${order.customer_id?.name.slice(0, 12)}...`
                : order.customer_id?.name}
            </h3>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-xs font-mono tracking-tight">
              #{order.order_number.split("-")[1]}
            </span>
          </div>

          <span
            className={`text-[10px]  capitalize font-bold px-2 py-0.5 rounded-full ${config.color}`}
          >
            {order?.payment_status}
          </span>
        </div>
        <div className="flex items-center gap-4  border-t pt-2 border-slate-100 text-gray-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-medium text-slate-700">
              {totalItems} items
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-black" />
            <span className="text-black font-semibold">10000MMK</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{format(new Date(order.created_at), "dd-MM-yyyy")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
