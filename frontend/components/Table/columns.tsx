"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  customer: string;
  orderdate: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "customer",
    header: "Customer ID",
  },
  {
    accessorKey: "orderdate",
    header: "Order Date",
  },
  {
    //should have badge with different colors based on status

    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "";
      switch (status) {
        case "pending":
          colorClass = "bg-[#F0D411] text-yellow-800";
          break;
        case "processing":
          colorClass = "bg-blue-100 text-blue-800";
          break;
        case "paid":
          colorClass = "bg-[#21C45D] text-green-800";
          break;
        case "failed":
          colorClass = "bg-red-100 text-red-800";
          break;
        default:
          colorClass = "bg-gray-100 text-gray-800";
      }
      return (
        <div className="flex gap-x-1 items-center">
          <div
            className={` w-2 h-2 inline-flex text-xs  font-semibold rounded-full ${colorClass}`}
          ></div>

          {status}
        </div>
      );
    },
  },
  {
    // format amount to include cedi sign
    accessorKey: "amount",
    header: "Amount",
  },
];
