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
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export function CustomerTable({ recentCustomers }) {
  return (
    <div className="bg-[#CFDECA] rounded-3xl p-5 py-4">
      <div className="mb-1">
        <h2 className="text-sm font-medium text-gray-700">
          Customer Management
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your customers and contact details
        </p>
      </div>
      {/* TABLE WRAPPER */}
      <div className=" rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className=" border-b">
              <TableHead className=" text-[13px]">Name</TableHead>
              <TableHead className=" text-[13px]">Phone</TableHead>
              <TableHead className=" text-[13px]">Status</TableHead>
              <TableHead className=" text-[13px]">Created</TableHead>
              {/* <TableHead className="text-right text-[13px]">Actions</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {recentCustomers?.length > 0 ? (
              recentCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-50 transition text-xs"
                >
                  <TableCell className="font-medium text-gray-700 ">
                    {customer.name}
                  </TableCell>

                  <TableCell className="text-gray-900 ">
                    {customer.phone}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        customer.status == "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-xs py-6 text-gray-500"
                >
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
