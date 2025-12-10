// This is to be a high order function
// Layout of the entire dahboard

import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <body className="grid gap-x-10 grid-cols-12 relative p-5">
      <Sidebar />
      <div className="col-span-10">
        <Header />
        <main className="">{children}</main>
      </div>
    </body>
  );
  //
};

export default Layout;
