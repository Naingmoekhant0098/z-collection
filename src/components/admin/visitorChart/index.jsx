
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

function VisitorInsightsChart() {

const data = [
  { name: "Jan", loyal: 20, new: 15, unique: 25 },
  { name: "Feb", loyal: 25, new: 20, unique: 30 },
  { name: "Mar", loyal: 15, new: 25, unique: 20 },
  { name: "Apr", loyal: 30, new: 30, unique: 35 },
  { name: "May", loyal: 25, new: 35, unique: 30 },
  { name: "Jun", loyal: 35, new: 25, unique: 40 },
  { name: "Jul", loyal: 30, new: 40, unique: 35 },
  { name: "Aug", loyal: 40, new: 35, unique: 45 },
  { name: "Sep", loyal: 35, new: 45, unique: 40 },
  { name: "Oct", loyal: 45, new: 40, unique: 50 },
  { name: "Nov", loyal: 40, new: 50, unique: 45 },
  { name: "Dec", loyal: 50, new: 45, unique: 55 },
]

  return (
 
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Visitor Insights</CardTitle>
          <button className="text-sm text-main hover:text-[#00A98B]/80">Export</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#ce8d23" }} />
              <YAxis hide />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#ce8d23" }}
              />
              <Line
                type="monotone"
                dataKey="loyal"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                name="Loyal Customers"
              />
              <Line type="monotone" dataKey="new" stroke="#ce8d23" strokeWidth={2} dot={false} name="New Customers" />
              <Line
                type="monotone"
                dataKey="unique"
                stroke="#261712"
                strokeWidth={2}
                dot={false}
                name="Unique Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisitorInsightsChart;

 