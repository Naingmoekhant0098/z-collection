import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Loader2 } from "lucide-react"

export function DeleteAccountConfirmation({ 
  isOpen, 
  handleClose, 
  data, 
  type, 
  handleDelete, 
  isDeleteLoading 
}) {
   
  const targetName = data?.name || data?.title || data?.royal_order_number || data?.platform || "";

  const handleDeleteAccount = (e) => {
    handleDelete(e)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center pt-2">
          
          <div className="p-3 bg-red-50 rounded-full mb-3 text-red-600 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <DialogTitle className="text-xl font-bold text-slate-900">
            Delete {type}?
          </DialogTitle>
          
          <DialogDescription className="text-sm text-slate-500 mt-2 max-w-[280px]">
            Are you sure you want to delete <span className="font-semibold text-slate-800">"{targetName}"</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 sm:justify-center w-full">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              onClick={handleClose} 
              disabled={isDeleteLoading}
              className="w-full sm:w-28 h-11 rounded-xl text-slate-500 font-medium hover:bg-slate-50"
            >
              Cancel
            </Button>
          </DialogClose>
          
          <Button
            variant="destructive"
            onClick={(e)=>handleDeleteAccount(e)}
            disabled={isDeleteLoading}
            className="w-full sm:w-32 bg-red-600 hover:bg-red-700 text-white h-11 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isDeleteLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              `Yes, Delete`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}