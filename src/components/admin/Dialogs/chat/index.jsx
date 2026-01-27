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
import { Loader2, FileText, Plus, X } from "lucide-react";
import customToast from "../../../customToast";

// Sample users
const users = [
  {
    id: 1,
    name: "Shad CN",
    email: "shadcn@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    name: "Liam Smith",
    email: "liam.smith@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    name: "Emma Williams",
    email: "emma.williams@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 5,
    name: "Noah Brown",
    email: "noah.brown@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 6,
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 7,
    name: "Ethan Miller",
    email: "ethan.miller@example.com",
    avatar: "https://github.com/shadcn.png",
  },
];

export function ChatCreate({
  isOpen,
  handleColse,
  onRefresh,
  handleSubmit,
  type,
  selectedPost,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setFormData({ ...selectedPost });
    setSelectedUsers(selectedPost?.users || []);
  }, [type, selectedPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData?.name || !formData?.description) {
      customToast.error("Error", "Please fill in the service name!");
      setIsLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      users: selectedUsers,
    };

    handleSubmit(submitData);
    setFormData({});
    setSelectedUsers([]);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleColse}>
      <form onSubmit={handleCreate}>
        <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {type === "edit" ? "Edit Service" : "Create Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-1 space-y-4">
           
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">Name</Label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter  chat name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="pl-12 h-14 text-base border-gray-200 rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>

           
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">Description</Label>
              <Textarea
                name="description"
                placeholder="Type your description here."
                value={formData?.description || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="text-base border-gray-200 rounded-xl shadow-sm"
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-900">Selected Users</Label>
                <div className="space-y-1 flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                     
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full"
                        />
                      <X    onClick={() => handleRemoveUser(user.id)} className="w-4 h-4 bg-white text-red-500 absolute -top-2 rounded-full -right-2" />
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">Add Users</Label>
              <div className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id}>
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAddUser(user)}
                        disabled={selectedUsers.some((u) => u.id === user.id)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <hr className="my-1" />
                  </div>
                ))}
              </div>
            </div>

            
           
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 mt-4">
            <DialogClose asChild />
            <Button
              type="submit"
              onClick={handleCreate}
              className="w-full bg-main hover:bg-teal-700 text-white h-12 text-[15px] font-medium rounded-xl shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Save Post</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
