import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { BellRing, Send, Smartphone, Image as ImageIcon } from "lucide-react";
import customToast from "../../../components/customToast";
import { NotiService } from "../../../services/NotiService";

export default function SendNotificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const { create } = NotiService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      customToast.error(
        "Validation Error",
        "Please provide both a title and a message."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log("Pushing to Firebase:", formData);
      const  res =await create(formData);
      if(res.status){
        customToast.success("Success", "Notification sent to all devices");
      }else{
        customToast.error("Error", "Failed to send notification");
      }
   
      setFormData({ title: "", body: "" });
    } catch (error) {
      customToast.error("Error", "Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            Send Notification
          </div>
          <p className="text-sm text-gray-600">
            Broadcast messages to all app users via Firebase
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-none border border-gray-200 p-0">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700"
                >
                  Notification Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Flash Sale Alert!"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="focus-visible:ring-black text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700"
                >
                  Message Body
                </Label>
                <Textarea
                  id="body"
                  placeholder="Type your message here..."
                  rows={4}
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  className="focus-visible:ring-black resize-none text-sm"
                />
              </div>
              <div className="flex justify-end ">
                <Button
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white min-w-[150px]"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Now
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
