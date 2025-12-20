import StatCard from "../../components/ui/StatCard";
import { cardData, tabledata, tabledata2 } from "@/lib/data";
import ReportSection from "@/components/sections/ReportSection";
import { DataTable } from "@/components/Tables/tableOne";
import { DataTable2 } from "@/components/Tables/tableTwo";
import { columns } from "@/components/Tables/tableOne/columns";
import { columns2 } from "@/components/Tables/tableTwo/columns";

import FilterButton from "@/components/ui/FilterButton";
import AddProduct from "@/components/sections/AddProduct";

export default function Home() {
  return (
    <div className="  min-h-screen  font-sans ">
      {/* Stats ONe */}
      <div className="grid grid-cols-12 gap-y-5 px-5 lg:px-0 w-full h-fit gap-x-3">
        {cardData.map((card) => (
          <StatCard
            key={card.name}
            name={card.name}
            value={card.value}
            prev={card.prev}
            amount={card.amount}
            currency={card.currency}
          />
        ))}
      </div>
      {/* Stats ONe */}

      {/* Report and user INsight */}
      <section className="grid grid-cols-12 mt-10 gap-y-5 px-5 lg:px-0 w-full h-fit gap-x-5">
        <ReportSection />
        <div className="lg:col-span-9  col-span-12 bg-background py-4 px-0 rounded-sm shadow-md ">
          <div className="flex justify-between w-full px-5 items-center py-4">
            <h2 className="font-semibold text-lg mb-5">Recent Transactions</h2>

            {/* filter Button */}
            <FilterButton values={["pending", "sucess", "cancelled"]} />
          </div>
          <DataTable columns={columns} data={tabledata} />
        </div>
        <div className="lg:col-span-8  col-span-12 bg-background py-4 px-0 rounded-sm shadow-md ">
          <div className="flex justify-between w-full px-5 items-center py-4">
            <h2 className="font-semibold text-lg mb-5">
              Best Selling Products
            </h2>

            {/* filter Button */}
            <FilterButton values={["stock", "Stock out"]} />
          </div>
          <DataTable2 columns={columns2} data={tabledata2} />
        </div>
        <AddProduct />
      </section>
    </div>
  );
}
