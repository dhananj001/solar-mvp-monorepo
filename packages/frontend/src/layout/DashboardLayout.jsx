import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

import {
  Home,
  Users,
  Calculator,
  DollarSign,
  Calendar,
  Box,
  Menu,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
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

  function handleLogout() {
    // Clear user session / auth tokens here
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  }

  return (
    <div className="h-screen w-screen flex bg-slate-50 overflow-hidden">
      {/* ---------- Sidebar (fixed, never scrolls) ---------- */}
      <aside
        className={cn(
          'flex flex-col shrink-0 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 shadow-lg transition-all duration-300 z-40',
          isCompact ? 'w-20' : 'w-64',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 h-16 shrink-0">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {!isCompact && (
              <h1 className="ml-3 text-lg font-semibold text-slate-800 tracking-tight">
                Solar Business
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        <Separator className="bg-slate-200/50 shrink-0" />

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = location.pathname === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
                      isCompact && 'justify-center'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        active ? 'text-indigo-500' : 'text-slate-400'
                      )}
                    />
                    {!isCompact && <span className="leading-none">{label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle stuck at visual bottom */}
        <div className="shrink-0 border-t border-slate-200/50 p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full flex items-center justify-center text-slate-500 hover:bg-slate-100/70',
              isCompact && 'px-0'
            )}
            onClick={() => setIsCompact(!isCompact)}
          >
            {isCompact ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronsLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* ---------- Main area (header + content) ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (fixed, never scrolls) */}
        <header className="flex items-center justify-between h-16 px-5 shrink-0 bg-white/60 backdrop-blur-xl border-b border-slate-200/50">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>

          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem> */}

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
        </header>

        {/* Page content (scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-2xl shadow-sm p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
