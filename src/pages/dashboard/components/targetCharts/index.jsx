import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function OrderStatusChart({orderStatus}) {
  const pending = orderStatus?.filter((os)=>os._id=="pending")[0];
  const completed = orderStatus?.filter((os)=>os._id=="completed")[0];
  const cancelled = orderStatus?.filter((os)=>os._id=="cancelled")[0];
  
  const data = [
    { name: "Completed", value: completed ? completed?.count : 0, fill: "#E7E57A" },
    { name: "Pending", value: pending ? pending?.count : 0, fill: "#8A8A8A" },
    { name: "Cancelled", value: cancelled ? cancelled?.count : 0, fill: "#B91C1C" },
  ];
  return (
    <div className="bg-[#CFDECA] rounded-3xl p-5 py-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          Order Status Overview
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Breakdown of completed, pending and cancelled orders
        </p>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="35%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tickMargin={6}
              fontSize={11}
            />

            <YAxis hide />

            <Tooltip
            cursor={false} 
              contentStyle={{
                fontSize: 12,
                border: "none",
                boxShadow: "none",
                borderRadius: "8px",
              }}
            />

            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Pending</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
}
