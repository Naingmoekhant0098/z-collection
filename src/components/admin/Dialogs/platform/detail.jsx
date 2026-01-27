 

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
  BadgePercent,
  PiggyBank,
  BadgeDollarSign,
  BadgeCheck,
  Database,
  TimerIcon,
} from "lucide-react"

export function PlatformDetail({ isOpen, handleClose, user, onEdit, onDelete }) {
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

  

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        

        <div className="space-y-6">
         <div>
         <div className=" font-semibold text-xl">{user?.platform}</div>
         <div className=" text-[15px] mt-1">{user?.platform_description }</div>
         </div>
    

           
          <div className=" grid grid-cols-2">
            <div className="space-y-4">
                
                <div className=" flex items-center gap-2">
                    <div>
                        <PiggyBank />

                    </div>
                    <div>
                        {user?.platform_fee}
                    </div>
                </div>
                <div className=" flex items-center gap-2">
                    <div>
                        <BadgeCheck />

                    </div>
                    <Badge>
                        {user?.status ? "Active" : "Inactive"}
                    </Badge>
                </div>
                <div className=" flex items-center gap-2">
                    <div>
                        <BadgeCheck />

                    </div>
                    <Badge>
                        {user?.isVerify ? "Verified" : user?.isVerify == 0 ? "Pending"  : "Unverified"}
                    </Badge>
                </div>
                
            </div>
            <div className="space-y-4">
            <div className=" flex items-center gap-2">
                    <div>
                        <BadgeDollarSign />

                    </div>
                    <div>
                        {user?.total_fee}
                    </div>
                </div>

                <div className=" flex items-center gap-2">
                    <div>
                        <TimerIcon />

                    </div>
                    {new Date(user?.created_at).toLocaleDateString()}
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
