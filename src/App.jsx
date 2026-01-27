import React from "react";
import { Route, Routes } from "react-router-dom";

import { AdminLogin } from "./pages/auth/Auth";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "./pages/dashboard/Dashboard";
import Posts from "./pages/post/Posts";
import AdminLayout from "./layout";
import User from "./pages/user/Users";
import SendNoti from "./pages/send-noti/sendNoti";
import Setting from "./pages/setting/setting";
import Ads from "./pages/ads/Ads";
import PreventRoute from "./components/preventRoute";

function App() {
  return (
    <>
      <Routes>
      
        <Route path="/login" element={<AdminLogin />} />

    
        <Route element={<PreventRoute />}>
     
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<User />} />
            <Route path="settings" element={<Setting />} />
            <Route path="posts" element={<Posts />} />
            <Route path="send-notification" element={<SendNoti />} />
            <Route path="advertisements" element={<Ads />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;