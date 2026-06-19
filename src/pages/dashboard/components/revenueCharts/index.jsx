import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function RevenueChart({ yearCompareData = [] }) {
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <div className="bg-[#E9EDF3] rounded-3xl p-5 py-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          Revenue Comparison ({currentYear - 1} vs {currentYear})
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Year-over-year monthly revenue comparison
        </p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={yearCompareData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 20,
            }}
          >
            {/* FIX 1: month not name */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={13}
              interval={0}
              padding={{ left: 16, right: 0 }}
            />

            <YAxis hide />

            <Tooltip
              formatter={(value) => {
                const num = Number(value || 0);
                return [`${num.toLocaleString()} MMK`];
              }}
              contentStyle={{
                fontSize: 12,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: "8px",
              }}
            />

            <Line
              type="natural"
              dataKey={currentYear - 1}
              stroke="#CFDECA"
              strokeWidth={4}
              dot={false}
            />

            <Line
              type="natural"
              dataKey={currentYear}
              stroke="#8A8A8A"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-8 text-xs mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E7E57A]" />
          <span>{currentYear - 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span>{currentYear}</span>
        </div>
      </div>
    </div>
  );
}
