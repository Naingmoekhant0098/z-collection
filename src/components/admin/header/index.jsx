import { Moon, Sun, Bell, ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);
  const segments = location.pathname.split("/").filter(Boolean);
  const lastSegment =
    segments.length === 3
      ? "detail"
      : segments.length > 0
      ? segments[segments.length - 1]
      : "Dashboard";
  if (lastSegment === "chats-list") return null;
  return (
    <header className="fixed top-0 z-30 right-0 left-0 md:left-64 h-16 bg-pink-100 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800  transition-all flex items-center">
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex-1 items-center">
          <h1 className="text-lg md:text-xl ml-7 md:ml-0 text-center md:text-left pl-10 md:pl-0 font-semibold text-gray-900 dark:text-white capitalize">
            {lastSegment.replace(/-/g, " ")}
          </h1>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </Button>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-800 mx-2 hidden md:flex" />

          <div className="hidden md:flex items-center gap-3 pl-2">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                Musfiq
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Admin
              </span>
            </div>
            <Avatar className="w-9 h-9 border border-gray-200 dark:border-slate-800 shadow-sm">
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback className="bg-gray-100 dark:bg-slate-800">
                AD
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
