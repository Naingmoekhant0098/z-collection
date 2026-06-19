import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";

export function RecentOrderTable({ recentOrders = [] }) {
  return (
    <div className="bg-[#E9EDF3] rounded-3xl p-5 py-4">
      <div className="mb-1">
        <h2 className="text-sm font-medium text-gray-700">
          Recent Orders
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Latest customer orders and status updates
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-[13px]">Order No</TableHead>
              <TableHead className="text-[13px]">Items</TableHead>
              <TableHead className="text-[13px]">Amount</TableHead>
              <TableHead className="text-[13px]">Status</TableHead>
              <TableHead className="text-[13px]">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 transition text-xs"
                >
                  <TableCell className="font-medium text-gray-900">
                    {order.order_number}
                  </TableCell>

                  <TableCell>
                    {order.items?.length || 0} Items
                  </TableCell>

                  <TableCell>
                    {Number(order.total_amount).toLocaleString()} MMK
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-xs py-6 text-gray-500"
                >
                  No recent orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}