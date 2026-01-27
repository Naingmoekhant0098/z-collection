import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import {
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  ShieldUser,
  ShieldAlert,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";

export function VerificationDetail({ isOpen, handleClose, user, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-main text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "verified":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Verification Detail
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            View full information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <Avatar className="h-16 w-16 ring-2 ring-emerald-200">
              <AvatarImage
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.name}
              />
              <AvatarFallback className="bg-main text-white text-lg font-semibold">
                {user?.name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("")
                  ?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {user?.name}
                {user?.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs font-medium ${getStatusColor(user?.status)}`}>
                  {user?.status}
                </Badge>
                <Badge className={`text-xs font-medium ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact & Profile Details */}
          <div className="space-y-4">
            {/* Email */}
            <InfoRow icon={<Mail />} label="Email" value={user?.email} />

            {/* Phone */}
            <InfoRow icon={<Phone />} label="Phone" value={user?.phone || "Not Provided"} />

            {/* Join Date */}
            <InfoRow icon={<Calendar />} label="Join Date" value={user?.joinDate} />

            {/* Check-In Date */}
            <InfoRow icon={<Calendar />} label="Check-In Date" value={user?.checkInDate} />

            {/* Expiry Date */}
            <InfoRow icon={<Calendar />} label="Expire Date" value={user?.expireDate} />

            {/* Last Active */}
            <InfoRow icon={<Clock />} label="Last Active" value={user?.lastActive} />

            {/* Points */}
            <InfoRow icon={<Star />} label="Loyalty Points" value={`${user?.points || 0} pts`} />

            {/* Role */}
            <InfoRow icon={<ShieldUser />} label="Role" value={user?.role} />

            {/* Status */}
            <InfoRow icon={<ShieldAlert />} label="Status" value={user?.status} />
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex gap-2 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Close
            </Button>
          </DialogClose>

          {onEdit && (
            <Button
              onClick={onEdit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11 rounded-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </Button>
          )}

          {onDelete && (
            <Button
              onClick={onDelete}
              variant="destructive"
              className="h-11 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Reusable row component
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
      <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{value || "N/A"}</p>
      </div>
    </div>
  );
}
