import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
} from 'lucide-react';
import { motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const dockItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/crm', label: 'CRM', icon: Users },
    { href: '/quotes', label: 'Quotes', icon: Calculator },
    { href: '/subsidies', label: 'Subsidies', icon: DollarSign },
    { href: '/projects', label: 'Projects', icon: Calendar },
    { href: '/inventory', label: 'Inventory', icon: Box },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 text-black">
      {/* ---------- Page Content ---------- */}
      <main className="flex-1 overflow-y-auto pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* ---------- Dark-Glass Dock ---------- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-2 sm:gap-3 px-3 py-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          {dockItems.map(({ href, icon: Icon, label }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center gap-1 w-16 sm:w-20"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-colors',
                    active
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Notifications */}
          <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-slate-300 hover:bg-slate-700/50"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
              Alerts
            </span>
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-600"
                />
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                  Profile
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}