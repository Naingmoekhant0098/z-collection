import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  LayoutList,
  MessagesSquare,
  Settings,
  LogOut,
  Menu,
  Settings2,
  Bell,
  BellRing,
} from "lucide-react";
import logo from "../../../assets/images/logo2.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogoutConfirmation } from "../Dialogs/logout/index";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: LayoutList, label: "Products", path: "/admin/products" },
  { icon: LayoutList, label: "Categories", path: "/admin/categories" },
  { icon: LayoutList, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleCloseMobile = () => setIsMobileOpen(false);
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <img
            src={logo}
            className="w-14 h-14 aspect-square object-cover"
            alt="Logo"
          />
          <div className="font-semibold text-lg">Z Collection</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {sidebarItems.map((item) => (
          <Button
            onClick={() => {
              handleCloseMobile();
              navigate(item.path);
            }}
            key={item.label}
            variant={location.pathname === item.path ? "default" : "ghost"}
            className={cn(
              "w-full justify-start  gap-3 h-10 text-[14px] py-2!",
              location.pathname === item.path
                ? "bg-main text-white hover:bg-main/90"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="w-full justify-start gap-2! h-12 text-[14px] text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-3 left-4 z-40">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-900" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden  lg:flex w-64 border-r border-gray-200 h-screen flex-col fixed left-0 top-0 bg-white">
        <SidebarContent />
      </aside>

      {isOpen && (
        <LogoutConfirmation isOpen={isOpen} handleColse={handleClose} />
      )}
    </>
  );
}
