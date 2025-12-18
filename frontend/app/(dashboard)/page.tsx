import StatCard from "../../components/ui/StatCard";
import { cardData, tabledata } from "@/lib/data";
import ReportSection from "@/components/sections/ReportSection";
import { DataTable } from "@/components/Table";
import { columns } from "@/components/Table/columns";

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
        <div className="col-span-8 bg-background py">
          <DataTable columns={columns} data={tabledata} />
        </div>

        <div className="col-span-4">Hello</div>
      </section>
    </div>
  );
}
