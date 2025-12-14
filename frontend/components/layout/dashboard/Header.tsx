"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Bell, LayoutDashboard, Search } from "lucide-react";
import { useSidebarStore } from "../stores/useSIdebarStore";

import ThemeToggle from "@/components/ui/ToggleTheme";

const Header = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  console.log("header rendered");
  return (
    <header className="col-span-11 flex px-5   bg-background py-6 items-center   justify-between  min-h-16 lg:px-10 pb-5">
      {/* Avatar */}
      <div className="text-2xl text-secondary">Dashboard</div>
      {/* Serch bar */}
      <div className=" gap-x-7 hidden lg:flex items-center w-1/2">
        <InputGroup className="outline-0 border-0 bg-sidebar-primary-foreground rounded-full h-10 flex-1">
          <InputGroupInput placeholder="Search data, users, or reports" />

          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className=" relative">
          <Bell className="text-gray-600" />
          <div className="w-2 h-2 rounded-full bg-foreground absolute top-0 -right-1"></div>
        </div>

        <ThemeToggle />

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      {/* Serch bar and notification */}

      {/* menu btn for mobile */}

      <LayoutDashboard onClick={toggleSidebar} className="lg:hidden" />

      {/* menu btn for mobile */}
    </header>
  );
};

export default Header;
