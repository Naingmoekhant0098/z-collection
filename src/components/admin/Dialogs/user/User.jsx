import { useEffect, useRef, useState } from "react";

import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  UploadCloud,
  User,
  Lock,  
} from "lucide-react";

import customToast from "../../../customToast";
import FileService from "../../../../services/FileService";
import ProgressRing from "../../progressRing";
 
export function UserCreate({
  isOpen,
  handleColse,
  onRefresh,
 
  type,
  selectedUser,
}) {
  const [previewUrl, setPreviewUrl] = useState("https://github.com/shadcn.png");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    phone_number: "",
    image: "",
  });
  
 
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
        password: selectedUser.password || "",
        phone_number: selectedUser.phone_number || "",
        image: selectedUser.image || "",
      });
    } else {
 
      setFormData({
        name: "",
        email: "",
        role: "",
        password: "",
        phone_number: "",
        image: "",
      });
    }
  }, [selectedUser, type]);
  
  useEffect(() => {
    if (selectedUser && type === "edit") {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
        password: "",  
        image: selectedUser.image || "",
      });
      setPreviewUrl(selectedUser.image || "https://github.com/shadcn.png");
    }
  }, [selectedUser, type]);

  
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); 
  };

   
  const fileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsFileUploading(true);
      const res = await FileService.fileUpload(file, setUploadPercentage);
      if (res.status && res.statusCode === 200) {
        const fileUrl = res?.data?.data?.url;
        setPreviewUrl(fileUrl);
        handleChange("profilePhoto", fileUrl);
        customToast.success("File Uploaded", "File successfully uploaded!");
      }
    } catch (error) {
      console.error(error);
      customToast.error("Upload Failed", "Something went wrong!");
    } finally {
      setIsFileUploading(false);
    }
  };

  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^[0-9]{9,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number (9–11 digits)";
    }
    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.password.trim() && type !== "editUser")
      newErrors.password = "Password is required";  
    return newErrors;
  };
 
  const submitHandler = async (e) => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
    let res;
    if(type === "editUser"){
      res= await UserService.updateUser(formData,selectedUser?.id);
    }else{
      res= await UserService.createUser(formData);
    }
    
    if (!res.status || res.statusCode !== 200) {
          setIsSubmitting(false)

          customToast.error(res.message);
          return;
        }
        if (res.status && res.statusCode == 200) {
          onRefresh();
          customToast.success("Success" , "Created Successfully!");
          handleColse();
        }
      setFormData({ name: "", email: "", role: "", password: "", image: "" });
      setPreviewUrl("https://github.com/shadcn.png");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      customToast.error("Error", "Failed to save user!");
    } finally {
      setIsSubmitting(false);
    }
  };


  // const handleSubmit = async (payload) => {
  //   if (type === "createUser") {
  //     try {
  //       setIsCreating(true);
  //       const res = await UserService.createUser(payload);
  //       console.log(res)
  //       // if (!res.status || res.statusCode !== 200) {
  //       //   setIsCreating(false);
  //       //   customToast.error("Error Creating User");
  //       //   return;
  //       // }
  //       // if (res.status && res.statusCode == 200) {
  //       //   console.log(res)
  //       //   setIsCreating(false);
  //       //   fetchUsers();
  //       //   customToast.success("User Created!");
  //       // }
  //     } catch (error) {}

  //     // const data = {
  //     //   ...payload,
  //     //   id: users.length + 1,
  //     //   status: "Active",
  //     //   verified: true,
  //     //   avatar: "/professional-woman-headshot-2.png",
  //     //   joinDate: "2024-03-10",
  //     //   lastActive: "5 minutes ago",
  //     // };

  //     // setUserss([...userss, data]);
  //     // setIsOpen(false);
  //   } 
  //   // else {
  //   //   setUserss(
  //   //     userss.map((us) =>
  //   //       us.id === payload?.id
  //   //         ? {
  //   //             ...us,
  //   //             email: payload.email,
  //   //             name: payload.name,
  //   //             role: payload.role,
  //   //           }
  //   //         : us
  //   //     )
  //   //   );

  //   //   setIsOpen(false);
  //   //   setSelectedUser(null);
  //   // }
  // };
 
  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
     
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {type === "edit" ? "Edit User" : "Create User"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
          
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-18 h-18">
                  <AvatarImage
                    src={previewUrl}
                    alt="User Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {isFileUploading && (
                  <div className="absolute inset-0 grid place-items-center bg-white/30 backdrop-blur-[1px] rounded-full">
                    <ProgressRing size={80} stroke={3} progress={uploadPercentage} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  variant="outline"
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Profile
                </Button>
                <input hidden ref={inputRef} type="file" onChange={fileUpload} />
              </div>
            </div>

            

           
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-12 h-14 text-base border-gray-200 focus:border-emerald-500 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

           
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-12 h-14 text-base border-gray-200 focus:border-emerald-500 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Phone Number
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Enter phone number"
                  className="pl-12 h-14 text-base border-gray-200 focus:border-emerald-500 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>


         
            {type !== "edit" && (
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-900 opacity-70"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-12 pr-12 h-14 text-base border-gray-200 focus:border-emerald-500 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}

         
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-900">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(val) => handleChange("role", val)}
              >
                <SelectTrigger className="w-full py-7 shadow rounded-xl">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
          </div>

         
          <button
            type="submit"
            onClick={submitHandler}
            className="w-full bg-main mt-4 flex justify-center items-center hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/30 transition-all duration-300 group transform hover:scale-[1.01]"
            disabled={isSubmitting || isFileUploading}
          >
            
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : type === "editUser" ? (
              "Update User"
            ) : (
              "Create Account"
            )}
          </button>
        </DialogContent>
      
    </Dialog>
  );
}
