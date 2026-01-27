import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Edit, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { SettingService } from "../../../../services/SettingService";
import { toast } from "sonner";

export function SettingsTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tempValue, setTempValue] = useState({});

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await SettingService().fetchAll();
      if (response?.status === true) {
        setData(response.data?.data || response.data || []);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (id, newValue) => {
    setIsUpdating(id);
    try {
      const response = await SettingService().updateByIdPut(id, { value: newValue });
      if (response?.status === true) {
        toast.success("Setting updated successfully");
        setData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, value: newValue } : item))
        );
        setIsModalOpen(false);
      } else {
        toast.error(response?.message || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      setIsUpdating(null);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTempValue(item.value);
    setIsModalOpen(true);
  };

  const renderValueAction = (item, subKey = null) => {
    const isSubSetting = subKey !== null;
    const currentValue = isSubSetting ? item.value[subKey] : item.value;

    if (typeof currentValue === "boolean") {
      return (
        <Switch
          disabled={isUpdating === item._id}
          checked={currentValue}
          onCheckedChange={(checked) => {
            const newValue = isSubSetting 
                ? { ...item.value, [subKey]: checked } 
                : checked;
            handleUpdate(item._id, newValue);
          }}
        />
      );
    }

   
  };

  return (
    <div className="p-1">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">App Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all system and app settings</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <Card key={item._id} className="shadow-none border-gray-200 pt-0 overflow-hidden">
              <CardContent className="p-0 divide-y divide-gray-100">
                <div className="bg-gray-50/50 px-4 py-3 font-semibold uppercase text-xs tracking-wider text-gray-600 flex justify-between items-center">
                  <span>{item.key.replace(/_/g, " ")}</span>
                  <Edit 
                    className="h-3.5 w-3.5 cursor-pointer hover:text-blue-600" 
                    onClick={() => openEditModal(item)} 
                  />
                </div>

                {typeof item.value === "object" && item.value !== null ? (
                  Object.entries(item.value).map(([subKey, subVal]) => (
                    <div key={subKey} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 capitalize">{subKey.replace(/_/g, " ")}</div>
                        <div className="text-xs text-gray-500 max-w-md">
                          {typeof subVal === "boolean" ? (subVal ? "True" : "False") : String(subVal)}
                        </div>
                      </div>
                      <div>{renderValueAction(item, subKey)}</div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">Configuration Details</div>
                      <div className="text-xs text-gray-500">{item.description || "System Setting"}</div>
                    </div>
                    <div>{renderValueAction(item)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Update {editingItem?.key.replace(/_/g, " ")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editingItem && typeof editingItem.value === "object" && editingItem.value !== null ? (
              Object.entries(editingItem.value).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
                  <Label className="capitalize font-medium text-gray-700">
                    {k.replace(/_/g, " ")}
                  </Label>
                  
                  {typeof v === "boolean" ? (
                    <Switch
                      checked={tempValue[k] === true}
                      onCheckedChange={(checked) => 
                        setTempValue({ ...tempValue, [k]: checked })
                      }
                    />
                  ) : (
                    <Input
                      className="max-w-[220px] text-sm"
                      value={tempValue[k] ?? ""}
                      onChange={(e) => setTempValue({ ...tempValue, [k]: e.target.value })}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between gap-4">
                <Label className="font-medium text-gray-700">Value</Label>
                {typeof editingItem?.value === "boolean" ? (
                  <Switch
                    checked={tempValue === true}
                    onCheckedChange={(checked) => setTempValue(checked)}
                  />
                ) : (
                  <Input
                    className="flex-1 "
                    value={tempValue ?? ""} 
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {/* <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button> */}
            <Button 
              disabled={isUpdating !== null} 
              onClick={() => handleUpdate(editingItem._id, tempValue)}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}