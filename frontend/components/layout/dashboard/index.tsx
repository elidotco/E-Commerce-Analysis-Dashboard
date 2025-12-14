// This is to be a high order function
// Layout of the entire dahboard

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
      <body className="grid text-text-color  bg-gray-50 grid-cols-12 relative">
        <Sidebar />

        <div className="col-span-10 hidden lg:block">
          <Header />
          <main className="p-10">{children}</main>
        </div>
        <div className="col-span-12 lg:hidden">
          <Header />
          <main className="">{children}</main>
        </div>
      </body>
    </TooltipProvider>
  );
  //
};

export default Layout;
