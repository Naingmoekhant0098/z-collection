import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { OrderService } from "../../../services/OrderService";

function RevenueChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchDailyStatus();
  }, []);
  const fetchDailyStatus = async () => {
    try {
      const response = await OrderService().fetchDaily();
      console.log("Daily Revenue Response:", response);
      if (response.success) {
        const dailyData = response?.data?.daily || [];
        const formattedData = dailyData.map((item) => ({
          name: item.name,
          count: item.count,
          revenue: item.revenue,
        }));
        console.log(formattedData);
        setData(formattedData);
      }
    } catch (error) {
      console.error("Unexpected error fetching daily revenue:", error);
    }
  };
  return (
    <Card className="border-0 shadow-sm pb-0">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Daily Sales Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-62 ">
          <ResponsiveContainer
            // style={{ marginLeft: "-24px" }}
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              barCategoryGap="30%"
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#48018E" }}
              />
              <YAxis
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: "#48018E" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#48018E" }}
              />
              <Bar
                dataKey="count"
                fill="#FFB6C1"
                radius={[4, 4, 0, 0]}
                name="Today Orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
export default RevenueChart;
