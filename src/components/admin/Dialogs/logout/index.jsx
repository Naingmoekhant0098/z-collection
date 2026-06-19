"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "../../../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog"
import {  LogOut } from "lucide-react"
import Cookies from "js-cookie"
export function LogoutConfirmation({isOpen ,handleColse}) {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    navigate('/login');
     
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className=" text-center mb-2">Confirm Logout</DialogTitle>
          <DialogDescription className=" text-center">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </DialogDescription>
          <div className=" flex justify-center gap-4 mt-4">
          <DialogClose onClick={handleColse}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogClose>
        </div>
        </DialogHeader>
       
      </DialogContent>
    </Dialog>
  )
}
