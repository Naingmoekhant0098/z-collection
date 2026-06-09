import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderCardSkeleton() {
  return (
    // CHANGED: md:flex-col (Desktop မှာ အထက်အောက်) နှင့် border ပါဝင်သော Card ပုံစံပြောင်းလဲထားသည်
    <div className="bg-white w-full p-4 md:p-5 border border-gray-100 rounded-xl flex flex-col sm:flex-row md:flex-col items-start gap-4 shadow-sm">
      
      {/* Profile Icon Section */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full">
        <Skeleton circle width={40} height={40} />
      </div>

      {/* Content Section */}
      {/* CHANGED: w-full ထည့်ထားခြင်းဖြင့် Grid ထဲမှာ နေရာအပြည့်ယူစေသည် */}
      <div className="flex-1 w-full space-y-3">
        
        {/* Top Line: Title & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <Skeleton width={100} height={14} />
            <Skeleton width={40} height={12} />
          </div>
          {/* Status Badge */}
          <Skeleton width={55} height={18} borderRadius={999} />
        </div>

        {/* Bottom Line: Metadata */}
        {/* CHANGED: flex-wrap သုံးထား၍ Screen သေးသွားလျှင် အောက်လိုင်း ဆင်းပေးမည် */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-2.5 border-slate-100">
          <Skeleton width={60} height={12} />
          <Skeleton width={70} height={12} />
          <Skeleton width={80} height={12} />
        </div>

      </div>
    </div>
  );
}