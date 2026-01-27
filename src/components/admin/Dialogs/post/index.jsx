import { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Loader2, FileText, CircleX, CheckCircle2 } from "lucide-react";
import customToast from "../../../customToast";
import FileService from "../../../../services/FileService";
import { Progress } from "@/components/ui/progress";
import { cn } from "../../../../lib/utils";

const categories = [
  "Football", "NBA", "Boxing", "MMA", "Cricket", "Tennis", "Badminton",
  "Table Tennis", "Volleyball", "Athletics", "Swimming", "Cycling",
  "Rugby", "Golf", "Formula 1", "Esports", "Wrestling", "Gymnastics",
  "Hockey", "Shooting", "Skateboarding", "Surfing", "Karate", "Judo",
];

export function PostCreate({
  isOpen,
  handleColse,
  handleSubmit,
  type,
  selectedPost,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    if (selectedPost && isOpen) {
      setFormData({
        ...selectedPost,
        image: selectedPost.featured_image || selectedPost.image || "",
        content: selectedPost.content || selectedPost.content || "",
      });
      setSelectedTags(selectedPost.tags || []);
    } else if (isOpen) {
      setFormData({});
      setSelectedTags([]);
    }
  }, [type, selectedPost, isOpen]);

  const toggleTag = (category) => {
    setSelectedTags((prev) =>
      prev.includes(category)
        ? prev.filter((t) => t !== category)
        : [...prev, category]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const onFormSubmit = async (e) => {
    e.preventDefault(); // This must be first
    
    if (!formData?.title || !formData?.content) {
      customToast.error("Required Fields", "Title and Content are mandatory.");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        content: formData.content,
        featured_image: formData.image,
        tags: selectedTags,
      };

      // Call the parent handle
      await handleSubmit(submitData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsFileUploading(true);
      const res = await FileService.fileUpload(file, setUploadPercentage);
      if (res.status) {
        // Adjust based on your API response structure
        const url = res.data?.url || res.data?.data?.image_url;
        setFormData((prev) => ({ ...prev, image: url }));
        customToast.success("Success", "Image uploaded!");
      }
    } catch (error) {
      customToast.error("Error", "Upload failed.");
    } finally {
      setIsFileUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      {/* Ensure the form wraps the content AND the footer */}
      <form onSubmit={onFormSubmit} className="contents">
        <DialogContent className="w-[700px] h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 border-b shrink-0">
            <DialogTitle>
              {type === "edit" ? "Edit News Post" : "Create News Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* Image Preview / Upload */}
            <div className="space-y-2">
              <Label className="font-semibold">Featured Image</Label>
              {formData?.image ? (
                <div className="relative group">
                  <img src={formData.image} className="w-full h-48 object-cover rounded-lg border" alt="Preview" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-red-500 hover:text-white"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    <CircleX className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                  <Input type="file" accept="image/*" onChange={fileUpload} className="hidden" id="post-image-input" />
                  <label htmlFor="post-image-input" className="cursor-pointer text-gray-500 text-sm block h-full w-full">
                    {isFileUploading ? `Uploading ${uploadPercentage}%...` : "Click to upload featured image"}
                  </label>
                </div>
              )}
              {isFileUploading && <Progress value={uploadPercentage} className="h-1 mt-2" />}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="font-semibold">Post Title</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5 pointer-events-none" />
                <Input
                  name="title"
                  required
                  value={formData?.title || ""}
                  onChange={handleInputChange}
                  placeholder="Headline of the news..."
                  className="pl-10 py-6 text-sm font-medium border-gray-200"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="font-semibold">Content (Myanmar/English)</Label>
              <Textarea
                name="content"
                required
                value={formData?.content || ""}
                onChange={handleInputChange}
                className="min-h-[200px] text-sm leading-relaxed border-gray-200"
                placeholder="Write news content here..."
              />
            </div>

            {/* Categories Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Select Categories ({selectedTags.length})</Label>
                {selectedTags.length > 0 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-red-500 hover:bg-red-50"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {categories.map((cat) => {
                  const isSelected = selectedTags.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleTag(cat)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                        isSelected 
                          ? "bg-black border-black text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-black"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3 pointer-events-none" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50/50 shrink-0">
        
            <Button
            onClick={onFormSubmit}
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-xl transition-all active:scale-[0.98]"
              disabled={isLoading || isFileUploading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                type === "edit" ? "Update News Post" : "Publish Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}