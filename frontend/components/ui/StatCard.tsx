"use client";
import { formatNumber } from "@/lib/functions";
import { Icon } from "@iconify/react";

interface ValueProps {
  name: string;
  value: number;
  analysis?: string;
  percent?: number;
  amount?: number;
  currency?: boolean; //look into how to make a default and also currency formatting
}
interface StatCardProps {
  name: string;
  value: ValueProps[];
  prev?: boolean;
  amount?: number;
  currency?: boolean;
}

const StatCard = ({ name, value, prev, amount, currency }: StatCardProps) => {
  return (
    <div className="col-span-12 relative sm:col-span-6 md:col-span-4 lg:col-span-4 bg-background rounded-md  dark:bg-gray-800 p-4  shadow-md pl-6">
      <div className="flex pb-2 font-medium text-secondary justify-between items-center">
        <p>{name}</p>
        <PreiodSelect />
      </div>
      <p className="text-gray-500 text-sm">Last 7 days</p>
      <div className="flex w-full pt-5">
        {value.map((val) =>
          value.length > 1 ? (
            <div
              key={val.name}
              className="flex flex-col  w-1/2 justify-between mx-2"
            >
              <p className="pr-1">{val.name}</p>
              <div className="text-2xl font-semibold flex  text-text-color">
                {val.currency === true ? "$" : ""}
                <p
                  className={`${val.name == "Cancelled" ? "text-red-500" : ""}`}
                >
                  {" "}
                  {formatNumber(val.value)}
                </p>
                <div className="flex pl-2 font-light  items-center">
                  {val.analysis === "Up" ? (
                    <Icon
                      icon="akar-icons:arrow-up"
                      className="text-green-500"
                      width="16"
                      height="16"
                    />
                  ) : val.analysis === "Down" ? (
                    <Icon
                      icon="akar-icons:arrow-down"
                      className="text-red-500"
                      width="16"
                      height="16"
                    />
                  ) : null}
                  {val.percent !== undefined && (
                    <p
                      className={`text-sm ml-1 ${
                        val.analysis === "Up"
                          ? "text-green-500"
                          : val.analysis === "Down"
                          ? "text-red-500"
                          : "text-text-color"
                      }`}
                    >
                      {val.percent}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              key={val.name}
              className="flex items-center text-center justify-center "
            >
              <p className="text-3xl font-semibold text-center text-text-color">
                {val.currency ? "$" : ""}
                {formatNumber(val.value)}
              </p>
              <div className="flex pl-2  items-center">
                <p className="pr-1">{val.name}</p>
                {val.analysis === "Up" ? (
                  <Icon
                    icon="akar-icons:arrow-up"
                    className="text-green-500"
                    width="16"
                    height="16"
                  />
                ) : val.analysis === "Down" ? (
                  <Icon
                    icon="akar-icons:arrow-down"
                    className="text-red-500"
                    width="16"
                    height="16"
                  />
                ) : null}
                {val.percent !== undefined && (
                  <p
                    className={`text-sm ml-1 ${
                      val.analysis === "Up"
                        ? "text-green-500"
                        : val.analysis === "Down"
                        ? "text-red-500"
                        : "text-text-color"
                    }`}
                  >
                    {val.percent}%
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>
      {prev && (
        <div className="flex items-center pt-2 ">
          <p className="text-sm text-gray-500 ml-1">Previous 7 days</p>{" "}
          <span className="text-tertiary">
            ( {currency ? "$" : ""}
            {amount})
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { usePreriod } from "../charts/stores/usePeriod";

export function PreiodSelect() {
  const { period, setPeriod } = usePreriod();

  const durations = [
    { label: "Last week", value: "7d" },
    { label: "Last Month", value: "30d" },
    { label: "Last 3Months", value: "90d" },
    { label: "Last 6months", value: "6m" },
    { label: "Last year", value: "1y" },
    { label: "All time", value: "all" },
  ];

  return (
    <Select value={period} onValueChange={setPeriod}>
      <SelectTrigger className="w-2 overflow-hidden border-none bg-transparent  shadow-none  ">
        <Icon icon="bi:three-dots-vertical" className="w-5 h-5" />
      </SelectTrigger>
      <SelectContent position="popper" align="start" side="bottom">
        {durations.map((duration) => (
          <SelectItem key={duration.value} value={duration.value}>
            {duration.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
