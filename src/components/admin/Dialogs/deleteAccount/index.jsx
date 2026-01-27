 

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

export function DeleteAccountConfirmation({ isOpen, handleClose ,data , type , handleDelete , isDeleteLoading}) {
    console.log(data)
  const [agentName, setAgentName] = useState("")
  const [confirmText, setConfirmText] = useState("")
   

  const isDeleteEnabled = agentName === data?.name || data?.title || data?.point ||data?.platform && confirmText === `delete my ${type}`

  const handleDeleteAccount = () => {
    if (isDeleteEnabled) {
        handleDelete(data?.id);
      handleClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Delete {type}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Are you sure to delete ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 ">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-sm font-light">
              To confirm, type <span className="font-semibold">"{data?.name || data?.title || data?.point || data?.platform}"</span>
            </Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder=""
              className="w-full py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-text" className="text-sm font-light">
              To confirm, type <span className="font-semibold">"delete my {type}"</span>
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder=""
              className="w-full py-5"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-400 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">Deleting {data?.name || data?.title || data?.point || data?.platform} cannot be undone.</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!isDeleteEnabled}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {
                isDeleteLoading ? "Deleting...." : "Delete Account"
            }
         
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
