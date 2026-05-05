"use client";

import { Card, CardContent } from "../../ui/card";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  ShieldCheck,
  Handshake,
  MessageCircle,
  DollarSign,
  Zap,
  UserPlus,
} from "lucide-react";
const metrics = [
  {
    title: "Total Products",
    value: "2,450",
    change: "+5% new products",
    icon: Package,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Total Customers",
    value: "76",
    change: "+12% this week",
    icon: Users,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Daily Sales",
    value: "$2,450",
    change: "+15% vs yesterday",
    icon: TrendingUp,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Today Orders",
    value: "$2,450",
    change: "+15% vs yesterday",
    icon: TrendingUp,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 md:gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className=" shadow-none border border-slate-100">
          <CardContent className="p-6 py-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </p>
                
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
