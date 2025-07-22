import { Outlet } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Home, Users, Calculator, DollarSign, Calendar, Box, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 md:static md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold">Solar Business</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <Separator />
        <NavigationMenu orientation="vertical" className="p-4">
          <NavigationMenuList className="flex flex-col space-y-2">
            <NavigationMenuItem>
              <NavigationMenuLink href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/crm" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Users className="h-5 w-5" />
                <span>CRM</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/quotes" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Calculator className="h-5 w-5" />
                <span>Quotes</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/subsidies" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <DollarSign className="h-5 w-5" />
                <span>Subsidies</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/projects" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Calendar className="h-5 w-5" />
                <span>Projects</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/inventory" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Box className="h-5 w-5" />
                <span>Inventory</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="absolute bottom-0 w-full p-4">
          <Separator />
          <NavigationMenu orientation="vertical">
            <NavigationMenuList className="flex flex-col space-y-2">
              <NavigationMenuItem>
                <NavigationMenuLink href="/settings" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/logout" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">User menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-500" /> {/* Placeholder avatar */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 max-w-7xl mx-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;