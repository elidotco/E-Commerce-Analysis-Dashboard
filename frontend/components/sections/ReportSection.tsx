"use client";
import { useState } from "react";
import { ChartOne } from "../charts";
import { PreiodSelect } from "../ui/StatCard";
import Toggle from "../charts/Toggle";
import { formatNumber } from "@/lib/functions";

const ReportSection = () => {
  const data = [
    { label: "Customers", value: 420 },
    { label: "Total products", value: 350 },
    { label: "Stock products", value: 250 },
    { label: "Out of Stock", value: 220 },
    { label: "Reveune", value: 35033 },
  ];
  // active tab state for data filtering
  const [label, setLabel] = useState<string>("Customers");

  return (
    <div className="col-span-12 min-h-56 bg-background shadow-md rounded-sm lg:col-span-8 px-5 py-4">
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg ">Report for this week</h2>
        <div className=" flex gap-x-5">
          <Toggle />
          <PreiodSelect />
        </div>
      </div>
      <div className="pt-6 grid grid-cols-10 gap-4 pb-4 mb-4">
        {data.map((item) => (
          <div
            onClick={() => setLabel(item.label)}
            key={item.label}
            className={`col-span-12 cursor-pointer lg:col-span-2 mb-2 ${
              label === item.label ? "border-primary" : "border-gray-200"
            } border-b-2 lg:mb-0 `}
          >
            <p className="text-xl  font-semibold text-text-color">
              {formatNumber(item.value)}
            </p>
            <p className="text-[12px] capitalize text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
      <ChartOne />
    </div>
  );
};

export default ReportSection;
