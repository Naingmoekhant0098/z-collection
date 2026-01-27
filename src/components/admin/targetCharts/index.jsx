
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", reality: 8, target: 12 },
  { name: "Feb", reality: 10, target: 14 },
  { name: "Mar", reality: 12, target: 16 },
  { name: "Apr", reality: 9, target: 13 },
  { name: "May", reality: 14, target: 18 },
  { name: "Jun", reality: 11, target: 15 },
  { name: "Jul", reality: 16, target: 20 },
  { name: "Aug", reality: 13, target: 17 },
  { name: "Sep", reality: 18, target: 22 },
  { name: "Oct", reality: 15, target: 19 },
  { name: "Nov", reality: 20, target: 24 },
  { name: "Dec", reality: 17, target: 21 },
]

export function TargetRealityChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Target vs Reality</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Bar dataKey="reality" fill="#261712" radius={[4, 4, 0, 0]} name="Reality Sales" />
              <Bar dataKey="target" fill="#ce8d23" radius={[4, 4, 0, 0]} name="Target Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-[#00A98B] rounded-full"></div>
              <span className="text-sm text-gray-600">Reality Sales</span>
            </div>
            <span className="text-lg font-semibold">8,823</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-main rounded-full"></div>
              <span className="text-sm text-gray-600">Target Sales</span>
            </div>
            <span className="text-lg font-semibold">12,122</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
