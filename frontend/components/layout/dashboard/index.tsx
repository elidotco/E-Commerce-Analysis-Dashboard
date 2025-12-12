// This is to be a high order function
// Layout of the entire dahboard

import { Tooltip } from "@radix-ui/react-tooltip";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <TooltipProvider>
      <body className="grid gap-x-10 grid-cols-12 relative p-5">
        <Sidebar />
        <div className="col-span-11">
          <Header />
          <main className="">{children}</main>
        </div>
      </body>
    </TooltipProvider>
  );
  //
};

export default Layout;
