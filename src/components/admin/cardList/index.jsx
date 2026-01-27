"use client"

import { Card, CardContent } from "../../ui/card"
import { TrendingUp, ShoppingCart, Package, Users, ShieldCheck, Handshake, MessageCircle, DollarSign, Zap, UserPlus } from "lucide-react"
const metrics = [
  {
    title: "Pending Registrations",
    value: "24",
    change: "+10% from yesterday",
    icon: UserPlus, // substitute with appropriate icon import
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "Pending Verifications",
    value: "12",
    change: "-5% from yesterday",
    icon: ShieldCheck, // substitute with appropriate icon import
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Open Deal Requests",
    value: "37",
    change: "+8% from yesterday",
    icon: Handshake, // substitute with appropriate icon import
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    title: "Active Chats",
    value: "14",
    change: "+3% from yesterday",
    icon: MessageCircle, // substitute with appropriate icon import
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    title: "Revenue (Fees)",
    value: "$1,250",
    change: "+15% from yesterday",
    icon: DollarSign, // substitute with appropriate icon import
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Points in Circulation",
    value: "85,000",
    change: "+2% from yesterday",
    icon: Zap, // substitute with appropriate icon import
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 md:gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-0 shadow-sm">
          <CardContent className="p-6 py-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
