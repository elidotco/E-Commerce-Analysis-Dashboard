import StatCard from "../../components/ui/StatCard";
export default function Home() {
  return (
    <div className="flex  min-h-screen  font-sans ">
      {/* Stats ONe */}
      <div className="grid grid-cols-12  w-full h-fit gap-x-3">
        <StatCard
          name="Total Sales"
          value={[
            {
              name: "Sales",
              value: 2399,
              analysis: "Up",
              percent: 12.4,
              amount: 600,
            },
          ]}
          prev={true}
          amount={203}
        />
        {/* <StatCard name="Total Sales" value={2399} prev={true} />
        <StatCard name="Total Sales" value={2399} prev={false} /> */}
      </div>
      {/* Stats ONe */}
    </div>
  );
}
