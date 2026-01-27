

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Jan", lastMonth: 30, thisMonth: 25 },
  { name: "Feb", lastMonth: 25, thisMonth: 30 },
  { name: "Mar", lastMonth: 35, thisMonth: 28 },
  { name: "Apr", lastMonth: 30, thisMonth: 35 },
  { name: "May", lastMonth: 40, thisMonth: 32 },
  { name: "Jun", lastMonth: 35, thisMonth: 40 },
  { name: "Jul", lastMonth: 45, thisMonth: 38 },
  { name: "Aug", lastMonth: 40, thisMonth: 45 },
]

 function SatisfactionChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Customer Satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis hide />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#6B7280" }}
              />
              <Area
                type="monotone"
                dataKey="lastMonth"
                stackId="1"
                stroke="#261712"
                fill="#261712"
                fillOpacity={0.6}
                name="Last Month"
              />
              <Area
                type="monotone"
                dataKey="thisMonth"
                stackId="2"
                stroke="#ce8d23"
                fill="#ce8d23"
                fillOpacity={0.6}
                name="This Month"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Last Month</span>
            <span className="font-semibold">$3,004</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-main rounded-full"></div>
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold">$4,504</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default SatisfactionChart;
