"use client";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import {
  ArrowRightFromLineIcon,
  BellIcon,
  Blocks,
  ChartBarIncreasing,
  ClipboardList,
  House,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSidebarStore } from "../stores/useSIdebarStore";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Image from "next/image";
import { adminNavList, navList, proNavList } from "@/lib/data";

const Sidebar = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  // get active page from the URL
  // CHeck out alternative to usePathname that does not re render the component on route change
  const activePage = usePathname();
  console.log(activePage);
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <aside
      className={`flex flex-col col-start-1 h-screen 
     lg:sticky lg:top-0 p-3 pt-0 pb-5 shadow   rounded-md overflow-y-auto  fixed w-full top-0 col-span-12 z-10 lg:col-span-2 bg-background ${
       isOpen ? "right-0" : "-right-full"
     } transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex pt-5 justify-between sticky top-0 z-10 bg-background mb-5">
        <Image src="/logo.svg" alt="logo text" width={100} height={20} />
        <div
          onClick={toggleSidebar}
          className="flex lg:hidden items-center relative"
        >
          <Icon
            icon="material-symbols-light:arrow-menu-close"
            width="30"
            height="30"
          />
          <div className="w-0.5 h-5 absolute right-2 bg-gray-600"></div>
        </div>
        <div className="lg:flex items-center hidden relative">
          <Icon
            icon="material-symbols-light:arrow-menu-close"
            width="30"
            height="30"
          />
          <div className="w-0.5 h-5 absolute right-2 bg-gray-600"></div>
        </div>
      </div>
      {/* Logo */}

      {/* Search bar for mobile version */}
      <div className="w-full pb-10 lg:hidden">
        <InputGroup className="outline-0 border-0 bg-sidebar-primary-foreground rounded-full h-10 flex-1">
          <InputGroupInput placeholder="Search" />

          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      {/* Search bar for mobile version */}

      {/* Navigation list */}
      <p>Main menu</p>
      <div className="  pt-4 justify-between  flex flex-col ">
        {navList.map((item) => (
          <div
            key={item.name}
            className={`flex items-center pl-2 gap-x-2 text-gray-500 hover:bg-sidebar-secondary-foreground p-2 ${
              activePage === item.path ? "bg-primary text-white" : ""
            } rounded-md cursor-pointer`}
          >
            <Icon icon={item.tag} width="24" height="24" />
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </div>
      {/* Navigation List */}
      {/* Product Navigation list */}
      <p className="pt-5">Product</p>
      <div className="  pt-4 justify-between  flex flex-col ">
        {proNavList.map((item) => (
          <div
            key={item.name}
            className={`flex items-center pl-2 gap-x-2 text-gray-500 hover:bg-sidebar-secondary-foreground p-2 ${
              activePage === item.path ? "bg-primary text-white" : ""
            } rounded-md cursor-pointer`}
          >
            <Icon icon={item.tag} width="24" height="24" />
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </div>
      {/* Navigation List */}
      {/* Navigation list */}
      <p className="pt-5"> Admin</p>
      <div className="  pt-4 justify-between  flex flex-col ">
        {adminNavList.map((item) => (
          <div
            key={item.name}
            className={`flex items-center pl-2 gap-x-2 text-gray-500 hover:bg-sidebar-secondary-foreground p-2 ${
              activePage === item.path ? "bg-primary text-white" : ""
            } rounded-md cursor-pointer`}
          >
            <Icon icon={item.tag} width="24" height="24" />
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </div>
      {/* Navigation List */}
    </aside>
  );
};

export default Sidebar;
