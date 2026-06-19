import { Outlet } from "react-router-dom";
import { Header } from "../components/admin/header/index";
import { Sidebar } from "../components/admin/sidebar/index";
import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />

      <div className="lg:pl-27 flex flex-col min-h-screen relative">
        <Header />

        <div className="flex-1  mt-3 p-3 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
