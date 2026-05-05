import React from "react";
import { Loader2 } from "lucide-react";
import loading from "../../assets/images/loading.json";
import Lottie from "lottie-react";
const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm transition-all">
      <div className="bg-white p-6 pt-0 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative flex items-center justify-center">
          <Lottie
            animationData={loading}
            loop={true}
            style={{ width: 150, height: 150 }}
          />
        </div>

        <div className="text-center -mt-10">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">
            {message}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 italic">
            Please do not close your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
