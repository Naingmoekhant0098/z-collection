import { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Loader2, FileText, DollarSign, CircleX, Upload } from "lucide-react";
import customToast from "../../../customToast";
import FileService from "../../../../services/FileService";
import { Progress } from "@/components/ui/progress";

export function OpenShareCreate({
  isOpen,
  handleColse,
  onRefresh,
  handleSubmit,
  type,
  selectedPost,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

   

  useEffect(() => {
    if (selectedPost) {
      setFormData({ ...selectedPost });
      setUploadedFiles(selectedPost?.business_files || []);
    } else {
      setFormData({});
      setUploadedFiles([]);
    }
  }, [type, selectedPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsFileUploading(true);
    try {
      const res = await FileService.fileUpload(files, setUploadPercentage);
      if (res.status && res.statusCode === 200) {
        const uploadedFiles = res?.data?.data?.data?.image_urls || [];
        setFormData((prev) => ({
          ...prev,
          business_files: uploadedFiles,
        }));
        customToast.success("Files Uploaded Successfully!");
      } else {
        customToast.error("Upload Failed", res.message);
      }
    } catch (error) {
      console.error(error);
      customToast.error("Upload Failed", "Something went wrong!");
    } finally {
      setIsFileUploading(false);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
     
    if (!formData?.title || !formData?.price || !formData?.description) {
      customToast.error("Error", "Please fill all required fields!");
      setIsLoading(false);
      return;
    }
    // const submitData = {
    //   ...formData,
    //   business_files: uploadedFiles,
    // };
    
    await handleSubmit(formData);
    setFormData({});
    setUploadedFiles([]);
    setIsLoading(false);
  };

  const handleFileDelete = (file) => {
    setFormData({
      ...formData,
      delete_images: [formData?.delete_images, file],
    });
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      <form onSubmit={handleCreate}>
        <DialogContent className="w-[625px] h-[750px] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {type === "edit" ? "Edit Service" : "Create Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-1 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Cover Image
              </Label>
              {!formData?.cover && (
                <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files; // ✅ get all selected files (FileList)
                  if (!files || files.length === 0) return;
              
                  try {
                    setIsFileUploading(true);
              
                    // ✅ Pass the entire FileList
                    const res = await FileService.fileUpload(files, setUploadPercentage);
              
                    if (res.status && res.statusCode === 200) {
                      // ✅ safely get first uploaded image URL
                      const fileUrl = res?.data?.data?.data?.image_urls?.[0];
                  
                      if (fileUrl) {
                        setFormData({ ...formData, cover: fileUrl });
                        customToast.success(
                          "Cover Uploaded",
                          "File successfully uploaded!"
                        );
                      }
                    } else {
                      customToast.error("Error", res.message || "Failed to upload cover!");
                    }
                  } catch (err) {
                    console.error("Upload error:", err);
                    customToast.error("Error", "Failed to upload cover!");
                  } finally {
                    setIsFileUploading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full"
              />
              
              )}

              {formData?.cover && (
                <div className="mt-2 relative">
                  <CircleX
                    onClick={() =>
                      setFormData({
                        ...formData,
                        delete_image: formData?.image,
                        image: "",
                      })
                    }
                    className="absolute top-2 right-2 hover:text-main cursor-pointer"
                  />
                  <img
                    src={formData.cover}
                    alt="Preview"
                    className="w-full object-cover h-[140px] rounded-md border"
                  />
                </div>
              )}
              {uploadPercentage > 0 && (
                <div className=" flex items-center  gap-2 mt-2">
                  <Progress value={uploadPercentage} />{" "}
                  <span className=" text-sm">{uploadPercentage}%</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-900">
                  Investment
                </Label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    name="investment"
                    type="text"
                    placeholder="Enter investment"
                    value={formData?.investment || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="pl-12 h-14 text-base border-gray-200 rounded-xl shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Title
              </Label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  value={formData?.title || ""}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="pl-12 h-14 text-base border-gray-200 rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData?.price || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) handleInputChange(e);
                  }}
                  disabled={isLoading}
                  className="pl-12 h-14 text-base border-gray-200 rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Description
              </Label>
              <Textarea
                name="description"
                placeholder="Type your description here."
                value={formData?.description || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="text-base border-gray-200 rounded-xl shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Business Files (Multiple Upload)
              </Label>
              <Input
                type="file"
                multiple
                onChange={fileUpload}
                disabled={isFileUploading || isLoading}
                className="w-full"
              />
              {uploadPercentage > 0 && formData?.image && isLoading && (
                <Progress value={uploadPercentage} />
              )}

              <div className="space-y-2 mt-2">
                {formData?.business_files?.length > 0 ? (
                  formData.business_files.map((file, index) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <div className="flex items-center gap-3">
                          {
                            <div className=" relative">
                              <img
                                src={file}
                                alt={`file-${index}`}
                                className="w-10 h-10 object-cover rounded-md border"
                              />
                              <CircleX
                                onClick={() => handleFileDelete(file)}
                                className="hover:text-main cursor-pointer absolute top-0 -right-3"
                                size={16}
                              />
                            </div>
                          }
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No business files uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 mt-4">
            <DialogClose asChild />
            <Button
              onClick={handleCreate}
              type="submit"
              className="w-full bg-main hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : type === "createPost" ? (
                "Create OpenShare"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
