import { Card, CardContent } from "../../../../components/ui/card";
import {
  ShoppingCart, // Added missing import
  TrendingUp,
  Package,
  Users,
} from "lucide-react";

export function MetricCards({ metricData }) {
  console.log(metricData)
  const metricsConfig = [
    {
      key: "products",
      title: "Total Products",
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      value: metricData?.products ?? 0 // Optional: fallback to 0 if undefined
    },
    {
      key: "customers",
      title: "Total Customers",
      icon: Users,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      value: metricData?.customers ?? 0
    },
    {
      key: "orders",
      title: "Today Orders",
      icon: ShoppingCart,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      value: metricData?.orders ?? 0
    },
    {
      key: "categories",
      title: "Today Categories",
      icon: TrendingUp,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      value: metricData?.categories ?? 0  
    },
  ];

  return (
    <div className="grid grid-cols-2    md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6">
      {metricsConfig.map((metric) => (
        <div key={metric.key} className="shadow-none bg-white rounded-3xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </p>
                <p className="text-[11px] md:text-sm text-gray-500">
                  {metric.title}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 md:w-6 md:h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}