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
  Menu,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
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
    <div className="h-screen w-screen flex bg-gray-100 text-black">
      {/* ---------- Collapsible Left Dock ---------- */}
      <aside
        className={cn(
          'flex flex-col bg-slate-900/70 backdrop-blur-xl border-r border-slate-700/50',
          'transition-all duration-300 ease-in-out',
          expanded ? 'w-64' : 'w-16'
        )}
      >
        {/* Header (Logo + Toggle) */}
        <div
          className={cn(
            'flex items-center h-16 px-3 border-b border-slate-700/50'
          )}
        >
          {expanded && (
            <div className="text-white font-bold text-lg mr-auto">Solar</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-700/50"
            onClick={() => setExpanded(!expanded)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-2 px-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location.pathname === href;
            return (
              <motion.div
                key={href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={href}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-md transition-colors',
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {expanded && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="border-t border-slate-700/50 p-2 space-y-2">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-full flex items-center gap-3 px-2 py-2 rounded-md text-slate-300 hover:bg-slate-700/50'
            )}
          >
            <Bell className="h-5 w-5 shrink-0" />
            {expanded && (
              <span className="text-sm font-medium">Notifications</span>
            )}
            <span className="ml-auto h-2 w-2 bg-red-500 rounded-full" />
          </motion.button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start px-2 py-2 text-slate-300 hover:bg-slate-700/50',
                  'flex items-center gap-3 rounded-md'
                )}
              >
                <div className="h-5 w-5 rounded-full bg-slate-600" />
                {expanded && (
                  <span className="text-sm font-medium">My Account</span>
                )}
              </Button>
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
      </aside>

      {/* ---------- Page Content ---------- */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}