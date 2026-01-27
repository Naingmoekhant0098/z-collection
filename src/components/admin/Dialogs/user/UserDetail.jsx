 

import { Button } from "../../../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog"
import { Badge } from "../../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import {
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  ShieldUser,
  ShieldAlert,
} from "lucide-react"

export function UserDetail({ isOpen, handleClose, user, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-main text-emerald-800 border-emerald-200"
      case 0:
        return "bg-red-100 text-red-800 border-red-200"
     
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "user":
        return "bg-teal-100 text-teal-800 border-teal-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  console.log(user);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">User Detail</DialogTitle>
          <DialogDescription className="text-gray-600">
            View complete Admin information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <Avatar className="h-16 w-16 ring-2 ring-emerald-200">
              <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="bg-main text-white text-lg font-semibold">
                {user?.name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("")
                  ?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs font-medium ${getStatusColor(user?.status)}`}>
                  {user?.status ? "Active" : "Inactive"}
                </Badge>
                <Badge className={`text-xs font-medium ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{user?.email || "Email not provided"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">{user?.phone_number}</p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Joined Date</p>
                <p className="text-sm text-gray-600">{user?.created_at}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center">
               
                  <ShieldUser className=" text-white" />
                
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Role</p>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 bg-main rounded-lg flex items-center justify-center">
               
               <ShieldAlert className=" text-white" />
             
           </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Status</p>
                <Badge className="text-[12px]  mt-1 capitalize">{user?.isVerify ? "Verified" : "Not Verified"}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex gap-2 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200 bg-transparent"
            >
              Close
            </Button>
          </DialogClose>

          {onEdit && (
            <Button
              onClick={onEdit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11 rounded-xl shadow-lg shadow-main/25 hover:shadow-lg hover:shadow-main/30 transition-all duration-300 transform hover:scale-[1.01]"
            >
              <Edit className="h-4 w-4 mr-2" />
            Update
            </Button>
          )}

          {onDelete && (
            <Button
              onClick={onDelete}
              variant="destructive"
              className="h-11 rounded-xl shadow-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
