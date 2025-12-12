"use client";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import {
  ArrowRightFromLineIcon,
  BellIcon,
  Blocks,
  Cannabis,
  ChartBarIncreasing,
  ClipboardList,
  House,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  // get active page from the URL
  const activePage = usePathname();
  console.log(activePage);

  const navList = [
    {
      name: "Home",
      tag: House,
      path: "/",
    },
    {
      name: "Orders",
      tag: ClipboardList,
      path: "/orders",
    },
    {
      name: "Analytics",
      tag: ChartBarIncreasing,
      path: "/analytics",
    },
    {
      name: "Customers",
      tag: Blocks,
      path: "/customers",
    },
    {
      name: "Notification",
      tag: BellIcon,
      path: "/notification",
    },
    {
      name: "Settings",
      tag: Settings,
      path: "/settings",
    },
  ];
  return (
    <aside
      className="flex flex-col justify-between col-start-1 h-[calc(100vh-40px)] 
     sticky top-5 p-5 items-center rounded-md col-span-1 bg-sidebar-primary-foreground"
    >
      {/* Logo */}
      <div className="flex">
        <Cannabis size={30} />
      </div>
      {/* Logo */}
      {/* Navigation list */}
      <div className="  justify-between  flex flex-col  h-1/2">
        {navList.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger>
              <div
                className={`flex items-center gap-x-2 text-sidebar-foreground hover:bg-sidebar-secondary-foreground p-2 ${
                  activePage === item.path ? "bg-sidebar-border bg-" : ""
                } rounded-md cursor-pointer`}
              >
                <item.tag />
                {/* <p className="text-sm">{item.name}</p> */}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      {/* Navigation List */}
      {/* Logout */}
      <div className="flex gap-x-3">
        {" "}
        <ArrowRightFromLineIcon />
      </div>
      {/* Logout */}
    </aside>
  );
};

export default Sidebar;
