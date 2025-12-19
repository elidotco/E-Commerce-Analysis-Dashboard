import StatCard from "../../components/ui/StatCard";
import { cardData, tabledata } from "@/lib/data";
import ReportSection from "@/components/sections/ReportSection";
import { DataTable } from "@/components/Table";
import { columns } from "@/components/Table/columns";
import { Filter } from "lucide-react";
import FilterButton from "@/components/ui/FilterButton";

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
      <section className="grid grid-cols-12 mt-10 gap-y-5 px-5 lg:px-0 w-full h-fit gap-x-3">
        <ReportSection />
        <div className="col-span-8 bg-background py-4 px-0 rounded-sm shadow-md ">
          <div className="flex justify-between w-full px-5 items-center py-4">
            <h2 className="font-semibold text-lg mb-5">Recent Transactions</h2>

            {/* filter Button */}
            <FilterButton />
          </div>
          <DataTable columns={columns} data={tabledata} />
        </div>

        <div className="col-span-4">Hello</div>
      </section>
    </div>
  );
}
