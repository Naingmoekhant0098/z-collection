// import { Outlet } from "react-router-dom";
// import { Header } from "../components/admin/header/index";
// import { Sidebar } from "../components/admin/sidebar/index";
// import React from "react";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
//       <Sidebar />

//       <div className="flex flex-col min-h-screen ">
//         <Header />

//         <div className="flex-1  mt-3 p-3 md:p-8">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }


import { Outlet } from "react-router-dom";
import { Header } from "../components/admin/header";
import { Sidebar } from "../components/admin/sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50! flex 0">
      <Sidebar />
      <div className="flex flex-1 w-full flex-col md:ml-64">
        <Header />
        <main className="flex-1 md:mt-14  p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}