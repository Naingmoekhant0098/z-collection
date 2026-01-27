import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { 
  Loader2, 
  Link as LinkIcon, 
  CircleX, 
  Activity, 
  Hash, 
  Layout, 
  Maximize 
} from "lucide-react";
import customToast from "../../../../components/customToast";
import FileService from "../../../../components/../services/FileService";
import { Progress } from "@/components/ui/progress";

export function Form({
  isOpen,
  handleColse,
  handleSubmit,
  type,
  selectedPost,
}) {
  const [formData, setFormData] = useState({
    link: "",
    priority: 1,
    type: "banner", // Enum Default
    size: "medium", // Enum Default
    is_active: true,
    image: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    if (selectedPost && isOpen) {
      setFormData({
        ...selectedPost,
        image: selectedPost.image || "",
        link: selectedPost.link || "",
        priority: selectedPost.priority || 1,
        type: selectedPost.type || "banner",
        size: selectedPost.size || "medium",
        is_active: selectedPost.is_active ?? true,
      });
    } else if (isOpen) {
      setFormData({
        link: "",
        priority: 1,
        type: "banner",
        size: "medium",
        is_active: true,
        image: ""
      });
    }
  }, [selectedPost, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.image) {
      customToast.error("Required", "Please upload a banner image.");
      return;
    }

    setIsLoading(true);
    try {
      await handleSubmit({
        ...formData,
        priority: Number(formData.priority)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      <form onSubmit={onFormSubmit} className="contents">
        <DialogContent className="w-[550px] bg-white rounded-xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl font-bold">
              {type === "edit" ? "Edit Banner" : "New Promotion Banner"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-6 max-h-[70vh] overflow-y-auto">
           
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700 mb-2">Banner Asset</Label>
              {formData?.image ? (
                <div className="relative group rounded-xl border overflow-hidden bg-gray-50">
                  <img src={formData.image} className="w-full h-32 object-contain" alt="Preview" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-red-500 hover:text-white"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition-all">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setIsFileUploading(true);
                      const res = await FileService.fileUpload(file, setUploadPercentage);
                      if (res.status) setFormData(p => ({ ...p, image: res.data.url }));
                      setIsFileUploading(false);
                    }} 
                    className="hidden" 
                    id="banner-up" 
                  />
                  <label htmlFor="banner-up" className="cursor-pointer text-sm text-gray-500 flex flex-col items-center">
                    {isFileUploading ? `Uploading ${uploadPercentage}%` : "Click to upload banner"}
                  </label>
                </div>
              )}
            </div>

            
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700 mb-2">Target URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="pl-10 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

           
            <div className="grid grid-cols-2 gap-4">
             
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 mb-2">Placement Type</Label>
                <div className="relative">
                  <Layout className="absolute left-3 top-3 text-gray-400 h-4 w-4 z-10" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm appearance-none focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="banner">Banner</option>
                    <option value="popup">Popup</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="interstitial">Interstitial</option>
                    <option value="landing">Landing</option>
                  </select>
                </div>
              </div>

              {/* Display Size Enum */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 mb-2">Display Size</Label>
                <div className="relative">
                  <Maximize className="absolute left-3 top-3 text-gray-400 h-4 w-4 z-10" />
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm appearance-none focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 mb-2">Priority</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Input
                    name="priority"
                    type="number"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 mb-2">Display Status</Label>
                <div className="flex items-center h-10 px-3 border rounded-xl bg-gray-50/50">
                  <Activity className="h-4 w-4 text-green-500 mr-2" />
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.value === "true" }))}
                    className="bg-transparent text-sm font-medium focus:outline-none w-full"
                  >
                    <option value="true">Active</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50/50">
            <Button
            onClick={onFormSubmit}
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-xl transition-all"
              disabled={isLoading || isFileUploading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (type === "edit" ? "Update Campaign" : "Launch Campaign")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}