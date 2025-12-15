import StatCard from "../../components/ui/StatCard";
import { cardData } from "@/lib/data";
export default function Home() {
  return (
    <div className="flex  min-h-screen  font-sans ">
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
    </div>
  );
}
