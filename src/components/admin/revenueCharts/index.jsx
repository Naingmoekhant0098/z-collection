 

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Monday", online: 15, offline: 10 },
  { name: "Tuesday", online: 25, offline: 15 },
  { name: "Wednesday", online: 20, offline: 12 },
  { name: "Thursday", online: 30, offline: 18 },
  { name: "Friday", online: 28, offline: 20 },
  { name: "Saturday", online: 35, offline: 25 },
  { name: "Sunday", online: 32, offline: 22 },
]

 function  RevenueChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#48018E" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#48018E" }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#48018E" }}
              />
              <Bar dataKey="online" fill="#ce8d23" radius={[4, 4, 0, 0]} name="Online Sales" />
              <Bar dataKey="offline" fill="#261712" radius={[4, 4, 0, 0]} name="Offline Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
export default RevenueChart;
