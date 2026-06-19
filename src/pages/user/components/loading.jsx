import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserCardSkeleton() {
  return (
    <div className="bg-white w-full p-3 border border-gray-100 rounded-xl shadow-sm">
      
      <div className="flex items-start gap-3">

        <div className="flex-shrink-0">
          <Skeleton circle width={40} height={40} />
        </div>

        <div className="flex-1 space-y-2">

          <div className="flex items-center justify-between gap-2">
            <Skeleton width={120} height={14} />
            <Skeleton width={60} height={18} borderRadius={999} />
          </div>

          <Skeleton width={`80%`} height={12} />

          <div className="flex items-center gap-2">
            <Skeleton width={90} height={10} />
          </div>

        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Skeleton height={28} width="50%" borderRadius={8} />
        <Skeleton height={28} width="50%" borderRadius={8} />
      </div>
    </div>
  );
}