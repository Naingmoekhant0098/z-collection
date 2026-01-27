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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserRoundX,
  DollarSign,
  Percent,
  CreditCard,
} from "lucide-react";
import { PostCreate } from "../Dialogs/post";
import { useEffect, useState } from "react";
import { PlatformFeeCreate } from "../Dialogs/platform";
import PlatformService from "../../../services/PlatformService";
import customToast from "../../customToast";
import { DeleteAccountConfirmation } from "../Dialogs/deleteAccount";
import { PlatformDetail } from "../Dialogs/platform/detail";
import { CustomLists } from "../customCardlist";

const feess = [
  {
    id: 1,
    platform: "MyPlatform",
    feeType: "Standard Service Fee",
    percentage: "10%",
    flatFee: "-",
    status: "Active",
    effectiveDate: "2024-09-01",
  },
  {
    id: 2,
    platform: "MyPlatform",
    feeType: "High-Tier Service Fee (Over $1000)",
    percentage: "5%",
    flatFee: "$1.00",
    status: "Scheduled",
    effectiveDate: "2025-01-01",
  },
  {
    id: 3,
    platform: "MyPlatform",
    feeType: "Monthly Subscription - Basic",
    percentage: "-",
    flatFee: "$19.00",
    status: "Active",
    effectiveDate: "2024-09-01",
  },
  {
    id: 4,
    platform: "MyPlatform",
    feeType: "Monthly Subscription - Pro",
    percentage: "-",
    flatFee: "$49.00",
    status: "Active",
    effectiveDate: "2024-09-01",
  },
  {
    id: 5,
    platform: "MyPlatform",
    feeType: "Listing Fee (Per Service)",
    percentage: "-",
    flatFee: "$2.00",
    status: "Active",
    effectiveDate: "2024-09-01",
  },
];

export function PlatformFeeTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [fees, setFees] = useState([...feess]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [type, setType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [Order, setOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [selectePlatform, setSelectedPlatform] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_fees: 0,
    verified_platforms: 0,
    active_platforms: 0,
  });
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-red-100 text-red-800";
    }
  };
  const getVerifiedColor = (verified) => {
    return verified === 1
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
      : !verified
      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
      : "bg-red-100 text-red-800 hover:bg-red-200";
  };
  const handleSubmit = async (payload) => {
    if (type === "createPlatformFee") {
      try {
        try {
          const response = await PlatformService.createPlatform(payload);
          if (!response?.status || response?.statusCode !== 200) {
            customToast.error(
              "Error Creating Platform",
              response?.message || "Something went wrong"
            );
            return;
          }
          fetchPlatforms();
          customToast.success("Success", "Platform Created");
        } catch (error) {
          console.error("Error Updating Platform Error:", error);
          customToast.error("An unexpected error occurred");
        }
      } catch (error) {}
    } else {
      try {
        const response = await PlatformService.updatePlatform(
          selectedFee?.id,
          payload
        );
        if (!response?.status || response?.statusCode !== 200) {
          customToast.error(
            "Error Updating Points",
            response?.message || "Something went wrong"
          );
          return;
        }
        fetchPlatforms();
        customToast.success("Success", "Point Updated");
      } catch (error) {
        console.error("Error Updating Point Error:", error);
        customToast.error("An unexpected error occurred");
      }
    }
    setIsOpen(false);
    setSelectedFee(null);
  };

  const fetchPlatforms = async () => {
    try {
      setIsLoading(true);
      // const payload = {
      //   order_by: Order,
      //   search: searchText,
      //   status: status,
      // };

      const response = await PlatformService.fetchPlatforms({});

      if (!response?.status || response?.statusCode !== 200) {
        customToast.error(
          "Error Fetching Users",
          response?.message || "Something went wrong"
        );
        return;
      }

      setPlatforms(response.data || []);

      setDashboardData(response.dashboardData);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      customToast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPlatforms();
  }, [searchText, Order, status]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDelete = (platform) => {
    setSelectedFee(platform);
    setDeleteOpen(true);
  };

  const deletePlatform = async (id) => {
    try {
      const response = await PlatformService.deletePlatform(id);
      if (!response?.status || response?.statusCode != 200) {
        customToast.error("Error Deleting Platform", response?.message);
      }
      if (response?.status && response?.statusCode === 200) {
        fetchPlatforms();
        customToast.success("Success", response?.message);
      }
    } catch (error) {}
  };
  const handleVerifyPlatform = async (id, status) => {
    try {
      const response = await PlatformService.updateVerify(id, status);
      if (!response?.status || response?.statusCode != 200) {
        customToast.error("Error Deleting Platform", response?.message);
      }
      if (response?.status && response?.statusCode === 200) {
        fetchPlatforms();
        customToast.success("Success", response?.message);
      }
    } catch (error) {}
  };

  const metrics = [
    {
      title: "Total Revenue",
      value: "$" + dashboardData?.total_fees,

      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Verified Platforms",
      value: dashboardData?.verified_platforms,

      icon: Percent,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Active Platforms",
      value: dashboardData?.active_platforms,

      icon: CreditCard,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <>
      <CustomLists data={metrics} />
      <Card className="w-full border-0 shadow-sm">
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Platform Fees
            </CardTitle>
            <p className="text-sm text-gray-600">
              View and manage platform fee structures
            </p>
          </div>
          <Button
            onClick={() => {
              setIsOpen(true);
              setType("createPlatformFee");
            }}
            className="bg-main hover:bg-hoverMain text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Button>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Platform</TableHead>
                  <TableHead>Platform Fee(Point)</TableHead>
                  <TableHead>Total Platform Fee</TableHead>
                  <TableHead>Platform Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verify Status</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {platforms?.length> 0 ? platforms.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="text-sm font-medium text-gray-900">
                      {fee.platform}
                    </TableCell>

                    <TableCell className="text-sm text-gray-700">
                      {fee.platform_fee}
                    </TableCell>

                    <TableCell className="text-sm text-gray-700">
                      ${fee.total_fee}
                    </TableCell>

                    <TableCell className="text-sm text-gray-700">
                      {fee?.platform_description.slice(0, 50)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getVerifiedColor(fee.isVerify)}>
                        {fee?.isVerify === 1
                          ? "Verified"
                          : fee.isVerify === 0
                          ? "Pending"
                          : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              const status = fee?.isVerify === 1 ? 2 : 1;
                              handleVerifyPlatform(fee?.id, status);
                            }}
                            className="cursor-pointer "
                          >
                            {fee?.isVerify !== 1 ? (
                              <div className=" flex items-center gap-2 text-green-400">
                                <UserCheck className="mr-2 text-green-400 hover:text-green-400 h-4 w-4" />
                                Verified
                              </div>
                            ) : (
                              <div className=" flex items-center gap-2 text-red-400">
                                <UserRoundX className="mr-2 text-red-400 hover:text-red-400 h-4 w-4" />
                                Unverified
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setIsOpenDetail(true);
                              setSelectedFee(fee);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedFee(fee);
                              setType("editPlatformFee");
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(fee)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
                :
                (
                  <TableCell colSpan={6} className=" text-center py-3">
                  There is no data yet! please create one
                </TableCell>
                )
              }
              </TableBody>
            </Table>
            <PlatformFeeCreate
              isOpen={isOpen}
              type={type}
              handleClose={() => {
                setIsOpen(false);
                setSelectedFee(null);
              }}
              handleSubmit={handleSubmit}
              selectedFee={selectedFee}
            />

            {deleteOpen && (
              <DeleteAccountConfirmation
                isOpen={deleteOpen}
                handleClose={() => setDeleteOpen(false)}
                data={selectedFee}
                type={"Platform"}
                handleDelete={deletePlatform}
              />
            )}

            {isOpenDetail && (
              <PlatformDetail
                isOpen={isOpenDetail}
                handleClose={() => setIsOpenDetail(false)}
                user={selectedFee}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
