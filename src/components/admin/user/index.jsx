import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import { Input } from "../../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [Order, setOrder] = useState("desc");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <>
      <Card className="w-full border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <p className="text-sm text-gray-600">
            Manage your customers and contact details
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex gap-3 items-center justify-between mb-4">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search customer name or phone..."
              className="w-[250px]"
            />

            <Select value={Order} onValueChange={setOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">ASC</SelectItem>
                <SelectItem value="desc">DESC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden ">
            <Table>
              <TableHeader className=" ">
                <TableRow className="bg-main rounded-xl">
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                 
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers?.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      {/* Name */}
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="text-gray-700">
                        {customer.phone}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={
                            customer.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Created */}
                      <TableCell className="text-gray-600 text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableCell colSpan={5} className="text-center py-4">
                    No customers found
                  </TableCell>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
