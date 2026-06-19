import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Printer,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { OrderService } from "../../services/OrderService";
import { format, isValid } from "date-fns";

export default function MinimalistOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const fullUrl = window.location.origin + location.pathname + location.search;
  const voucherRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);

  const fetchOrderById = async (id) => {
    try {
      const res = await OrderService().getById(id);
      if (res.data?.success) {
        setOrder(res.data?.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: voucherRef,
    documentTitle: `Order-${order?.order_number || id}`,
  });

  const orderDate = order?.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = isValid(orderDate)
    ? format(orderDate, "MMMM d, yyyy 'at' h:mm a")
    : "—";

  const displayId = order?.order_number?.includes("-")
    ? order.order_number.split("-")[1]
    : order?.order_number || "—";

  const paymentStatusColors = {
    delivered: "text-emerald-700 bg-emerald-50 border-emerald-100",
    pending: "text-amber-700 bg-amber-50 border-amber-100",
    cancelled: "text-rose-700 bg-rose-50 border-rose-100",
  };

  const currentPaymentStatus = order?.status?.toLowerCase() || "pending";

  return (
    <main className="flex-1 overflow-y-auto mt-12 md:mt-0   min-h-screen text-slate-800">
      <div className="hidden">
        <div
          ref={voucherRef}
          className="p-10 max-w-[80mm] mx-auto text-black font-sans space-y-6"
        >
          <div className="text-center space-y-2 flex flex-col items-center">
            <QRCode size={75} value={fullUrl} />
            <p className="text-[8px] tracking-wider text-gray-400 uppercase mt-1">
              Scan to Verify Order
            </p>
            <h2 className="text-base font-bold mt-2">#{displayId}</h2>
            <p className="text-[10px] text-gray-500">{formattedDate}</p>
          </div>
          <div className="border-t border-b border-dashed border-gray-300 py-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-semibold">
                {order?.customer_id?.name || order?.customer?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-semibold">
                {order?.customer_id?.phone || order?.customer?.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-semibold uppercase">
                {order?.payment_method}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="font-medium">
                    {item?.product_name || item?.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Qty: {item?.quantity} | {item?.size}/{item?.color}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item?.price * item?.quantity).toLocaleString()} Ks
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-300 pt-3 text-xs flex justify-between font-bold">
            <span>Total Payable:</span>
            <span>{order?.total_amount?.toLocaleString()} Ks</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-0 md:space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-1">
          <div className="flex items-start gap-3 min-w-0">
            <div
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </div>

            <div className="space-y-1 w-full ">
              <div className="flex flex-wrap justify-between w-full items-center gap-2">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Order ID:{" "}
                  <span className="font-mono text-slate-600 font-semibold">
                    {order?.royal_order_number || displayId}
                  </span>
                </h1>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wide px-2.5 py-0.5 rounded-full border shrink-0 ${
                    paymentStatusColors[currentPaymentStatus] ||
                    "bg-slate-50 text-slate-500"
                  }`}
                >
                  {currentPaymentStatus}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-11 md:pl-0 ">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto hidden md:block flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Order Items
                </h2>
                <span className="text-xs font-medium text-slate-400">
                  {order?.items?.length || 0} ITEMS
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {order?.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                        {item?.product_id ? (
                          <img
                            src={item.product_id.image}
                            alt={item?.product_name || item?.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate tracking-tight">
                          {item?.product_id?.name ||
                            item?.name ||
                            "Product Item"}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">
                          Size:{" "}
                          <span className="text-slate-600 font-semibold">
                            {item?.size || "—"}
                          </span>{" "}
                          &bull; Color:{" "}
                          <span className="text-slate-600 font-semibold">
                            {item?.color || "—"}
                          </span>{" "}
                          &bull; QTY:{" "}
                          <span className="text-slate-600 font-semibold">
                            {item?.quantity || "—"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-6">
                      <span className="text-sm font-bold text-slate-900 tracking-tight min-w-[70px]">
                        {(item?.price * item?.quantity).toLocaleString()} Ks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                Order Summary
              </h2>
              <div className="space-y-2.5 text-xs font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>
                    Subtotal (
                    {order?.items?.reduce((a, b) => a + (b.quantity || 0), 0) ||
                      0}{" "}
                    items)
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {order?.total_amount?.toLocaleString()} Ks
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping &amp; Logistics Handling</span>
                  <span className="text-emerald-600 font-semibold">
                    Free Shipping
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax Constraints</span>
                  <span className="text-slate-400">0.00 Ks</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-slate-900">
                  <span className="text-sm font-bold">Total Bill</span>
                  <span className="text-base font-extrabold tracking-tight">
                    {order?.total_amount?.toLocaleString()} Ks
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2.5">
                Customer Information
              </h2>
              <div className="space-y-2.5 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {order?.customer_id?.name ||
                      order?.customer?.name ||
                      "No phone recorded"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {order?.customer_id?.phone ||
                      order?.customer?.phone ||
                      "No phone recorded"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="italic text-slate-400 text-[11px]">
                    No email account associated
                  </span>
                </div>

                <div className="flex gap-2.5 text-xs font-medium text-slate-700 items-start leading-relaxed">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-800 font-semibold">
                      {order?.city || "Unknown City"}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {order?.address ||
                        "Missing full distribution route street details"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <QRCode size={80} value={fullUrl} fgColor="#1e293b" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verification Endpoint
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 max-w-[180px]">
                  Scan token path to verify or parse live state payload.
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto  md:hidden flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
