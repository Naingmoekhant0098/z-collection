import { Outlet } from "react-router-dom";
import { Header } from "../components/admin/header/index";
import { Sidebar } from "../components/admin/sidebar/index";
import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1  mt-16 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
          <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}
