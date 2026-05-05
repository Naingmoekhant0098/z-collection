import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { ProductService } from "../../services/PostService";
import { OrderService } from "../../services/OrderService";

export default function MinimalistOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const fullUrl = window.location.origin + location.pathname + location.search;
  const voucherRef = useRef();
  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);
  const fetchOrderById = async (id) => {
    try {
      const res = await OrderService().getById(id);
      if (res.data?.success) {
        console.log(res.data?.data);
        setOrder(res.data?.data);
      }
      console.log(res);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: voucherRef,
    documentTitle: `${order?.customer_id?.name}-${order?.order_number}`,
  });
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-y-auto  mb-20 ">
      <style>
        <style>
          {`
          @media print {
            @page { 
              size: auto; 
              margin: 0mm; /* Margin မပါဘဲ အပြည့်ထုတ်ရန် */
            }
            body { 
              background-color: white !important; 
              display: flex;
              justify-content: center; /* စာမျက်နှာအလယ်သို့ ပို့ရန် */
            }
            .no-print { display: none !important; } /* ခလုတ်ကို ဖျောက်ရန် */
          }
        `}
        </style>
      </style>

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-1.5 rounded-lg border border-slate-300 gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-white transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </div>
        </div>

        <div
          ref={voucherRef}
          className="max-w-md mx-auto bg-white min-h-screen shadow-sm"
          style={{ width: "100%", margin: "0 auto" }}
        >
          {/* Header */}
          <div className="p-8 pb-4 text-center space-y-2">
            <div className=" flex flex-col items-center justify-center">
              <QRCode size={80} value={fullUrl} fgColor="#000000" />
              <p className="text-[10px] font-medium mt-4 text-slate-400 uppercase tracking-[0.2em]">
                Scan to see order details
              </p>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                #{order?.order_number.split("-")[1]}
              </h1>
              <p className="text-xs font-medium text-slate-400">
                27 May, 2020 • 12:45 PM
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-8 py-4 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start text-xs border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">
                    Customer Name
                  </p>
                  <p className="text-emerald-600 font-semibold">
                    {order?.customer_id?.name}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">
                    Phone Number
                  </p>
                  <p className="text-slate-700 font-semibold">
                    {order?.customer_id?.phone}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-start text-xs border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">
                    Status
                  </p>
                  <p className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Delivered
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">
                    Payment
                  </p>
                  <p className="text-slate-700 font-semibold">
                    {order?.payment_method}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-medium uppercase text-[10px]">
                Delivery Address
              </p>
              <p className="text-sm font-medium text-slate-600">
                {order?.address}, {order?.city}
              </p>
            </div>
          </div>

          <div className="px-8 py-6 space-y-5">
            {order?.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    {item?.product_name}{" "}
                    <span className="text-slate-400 text-xs ml-1">
                      x{item?.quantity}
                    </span>
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Size: {item?.size} • Color: {item?.color}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {(item?.price * item?.quantity).toFixed(2)} MMK
                </p>
              </div>
            ))}
          </div>
          <div className="px-8 py-6 bg-slate-50/50 space-y-3">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Subtotal</span>
              <span>{order?.total_amount} MMK</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
              <span className="text-sm font-semibold text-slate-900 uppercase">
                Amount Paid
              </span>
              <span className="text-lg font-bold text-slate-900">
                {order?.total_amount}MMK
              </span>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 pb-3 bg-white/90 no-print">
          <button
            onClick={handlePrint}
            className="w-full bg-main text-white font-medium text-sm py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
          >
            <Download className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </main>
  );
}
