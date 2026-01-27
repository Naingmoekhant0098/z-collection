import React from "react";
import AdminLayout from "../../../layout";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Smile, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatList() {
    const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className=" bg-gray-50 flex justify-center items-center ">
        <Card className="w-full bg-white border-b border-gray-100 rounded-none p-4 flex flex-col">
          <div className="flex border-b pb-3 justify-between items-center mb-4">
          <div className=" flex items-center gap-2">
          <ArrowLeft onClick={()=>navigate('/admin/chats')} className="w-5 h-5 text-gray-500 cursor-pointer mb-1"/>
            <div>
              <h2 className="font-semibold text-lg">Design chat</h2>
              <p className="text-xs text-gray-500">23 members, 10 online</p>
            </div>
          </div>
            <div className="flex items-center gap-3 text-gray-500">
              <Smile className="w-5 h-5 cursor-pointer" />
              <Mic className="w-5 h-5 cursor-pointer" />
              <Paperclip className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            <div className="flex gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/jasmin.png" alt="Jasmin" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-indigo-50 rounded-2xl p-3">
                  <p className="font-medium text-indigo-800">Jasmin Lowery</p>
                  <p className="text-gray-700 text-sm">
                    I added new flows to our design system. Now you can use them
                    for your projects!
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>💬 4</span>
                  <span>👁️ 23</span>
                  <span>09:20</span>
                </div>
              </div>
            </div>
 
            <div className="flex gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/alex.png" alt="Alex" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-indigo-50 rounded-2xl p-3">
                  <p className="font-medium text-indigo-800">Alex Hunt</p>
                  <p className="text-gray-700 text-sm">
                    Hey guys! Important news!
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>👁️ 16</span>
                  <span>09:24</span>
                </div>
              </div>
            </div>

           
            <div className="flex gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/alex.png" alt="Alex" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-indigo-50 rounded-2xl p-3">
                  <p className="font-medium text-indigo-800">Alex Hunt</p>
                  <p className="text-gray-700 text-sm">
                    Our intern <span className="text-indigo-600">@jchurch</span>{" "}
                    has successfully completed his probationary period and is
                    now part of our team!
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>🔥 5</span>
                  <span>💜 4</span>
                  <span>👁️ 16</span>
                  <span>09:24</span>
                </div>
              </div>
            </div>

            {/* Message 4 (Right aligned) */}
            <div className="flex gap-2 justify-end">
              <div>
                <div className="bg-indigo-100 rounded-2xl p-3">
                  <p className="text-sm text-gray-800">
                    Jaden, my congratulations! I will be glad to work with you
                    on a new project 😊
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-1 text-xs text-gray-400">
                  <span>👁️ 10</span>
                  <span>09:27</span>
                </div>
              </div>
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/jaden.png" alt="Jaden" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
            </div>

            {/* Image message */}
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatars/team.png" alt="Team" />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <img
                  src="/chatroom.jpg"
                  alt="meeting"
                  className="rounded-2xl w-64 h-40 object-cover"
                />
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>👁️ 10</span>
                  <span>09:30</span>
                </div>
              </div>
            </div>

            {/* Audio message */}
            <div className="flex gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/jessie.png" alt="Jessie" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-indigo-50 rounded-2xl p-3 flex items-center gap-3">
                  <button className="bg-indigo-600 text-white rounded-full p-2">
                    ▶️
                  </button>
                  <div className="w-40 bg-indigo-200 h-1 rounded-full relative">
                    <div className="absolute bg-indigo-600 h-1 w-10 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">0:15</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>👁️ 10</span>
                  <span>09:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 mt-4 border-t pt-3">
            <Input
              placeholder="Your message"
              className="flex-1 rounded-full bg-gray-100 border-none focus:ring-0 focus:outline-none"
            />
            <Smile className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default ChatList;
