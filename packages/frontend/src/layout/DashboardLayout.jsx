import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  Calculator,
  DollarSign,
  Calendar,
  Box,
  Bell,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  const dockItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/crm", label: "CRM", icon: Users },
    { href: "/quotes", label: "Quotes", icon: Calculator },
    // { href: '/subsidies', label: 'Subsidies', icon: DollarSign },
    { href: "/projects", label: "Projects", icon: Calendar },
    { href: "/inventory", label: "Inventory", icon: Box },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getScale = (index) => {
    if (hoverIndex === null) return 1;
    const distance = Math.abs(hoverIndex - index);
    if (distance === 0) return 1.3;
    if (distance === 1) return 1.15;
    if (distance === 2) return 1.05;
    return 1;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 text-black">
      <main className="flex-1 overflow-y-auto pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* ---------- macOS Style Dock ---------- */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-end gap-2 sm:gap-3 px-4 py-2 rounded-3xl 
                        bg-slate-800/60 backdrop-blur-xl shadow-lg
                        border border-white/20 transition-all duration-300 hover:scale-[1.02]"
        >
          {dockItems.map(({ href, icon: Icon, label }, index) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center gap-1 w-14 sm:w-16 group relative"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Icon */}
                <motion.div
                  animate={{ scale: getScale(index) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-colors duration-300 shadow-lg",
                    active
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "text-white/90 hover:bg-white/10"
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <span className="text-[10px] sm:text-xs text-white/80 font-medium mt-1">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Notifications */}
          <div
            className="flex flex-col items-center gap-1 w-14 sm:w-16 group relative"
            onMouseEnter={() => setHoverIndex(dockItems.length)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.button
              animate={{ scale: getScale(dockItems.length) }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-white/90 hover:bg-white/10 shadow-lg"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100"
            >
              No new alerts
            </motion.div>

            <span className="text-[10px] sm:text-xs text-white/80 font-medium mt-1">
              Alerts
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="flex flex-col items-center gap-1 w-14 sm:w-16 group relative cursor-pointer"
                onMouseEnter={() => setHoverIndex(dockItems.length + 1)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <motion.button
                  animate={{ scale: getScale(dockItems.length + 1) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-md
             ring-1 ring-white/30 hover:ring-white/50 transition flex items-center justify-center"
                >
                  <User className="w-6 h-6 text-white" />
                </motion.button>
                <span className="text-[10px] sm:text-xs text-white/80 font-medium mt-1 select-none">
                  Profile
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-2
               animate-fade-in-down"
              sideOffset={6}
            >
              <DropdownMenuLabel className="text-gray-800 font-semibold select-none px-3 py-2">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-white/40" />
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 hover:bg-white/40 transition"
                >
                  <SettingsIcon className="h-5 w-5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 cursor-pointer
                 hover:bg-white/40 transition"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-5 w-5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
