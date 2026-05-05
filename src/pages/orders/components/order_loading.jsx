import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderCardSkeleton() {
  return (
    <div className="bg-white p-5 py-4 border-b rounded-xl border-gray-100 flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full">
        <Skeleton circle width={40} height={40} />
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skeleton width={120} height={14} />
            <Skeleton width={40} height={12} />
          </div>

          <Skeleton width={60} height={18} borderRadius={999} />
        </div>
        <div className="flex items-center gap-4 border-t pt-2 border-slate-100">
          <Skeleton width={70} height={12} />
          <Skeleton width={80} height={12} />
          <Skeleton width={90} height={12} />
        </div>

      </div>
    </div>
  );
}