import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Bell, Search, ShoppingCartIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="col-span-10 flex  sticky top-5 bg-background justify-between  h-16 px-10 pb-5">
      {/* Avatar */}
      <div className="flex gap-x-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-[14px] font-light text-sidebar-foreground ">
            Hi, Eli!
          </p>
          <p className="font-bold text-lg">Welcome Back!</p>
        </div>
      </div>
      {/* Serch bar */}
      <div className="flex gap-x-2  items-center w-1/2">
        <InputGroup className="outline-0 border-0 bg-sidebar-primary-foreground rounded-full h-10 flex-1">
          <InputGroupInput placeholder="Search" />

          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex gap-4">
          <div className=" relative">
            <ShoppingCartIcon />
            <div className="w-2 h-2 rounded-full bg-foreground absolute top-0 -right-1"></div>
          </div>
          <div className=" relative">
            <Bell />
            <div className="w-2 h-2 rounded-full bg-foreground absolute top-0 -right-1"></div>
          </div>
        </div>
      </div>
      {/* Serch bar and notification */}
    </header>
  );
};

export default Header;
