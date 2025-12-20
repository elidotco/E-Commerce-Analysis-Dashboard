"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  product: string;
  totalOrder: number;
  status: "stock" | "out of stock" | "discontinued";
  price: number;
  image: string;
};

export const columns2: ColumnDef<Payment>[] = [
  {
    //this has an image and product name
    accessorKey: "product",

    header: "Product",
    cell: ({ row }) => {
      const product = row.original.product;
      const image = row.original.image;
      return (
        <div className="flex items-center gap-x-3">
          <img
            src={image}
            alt={product}
            className="w-8 h-8 hidden md:flex rounded-sm object-cover"
          />
          <span>{product}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "totalOrder",
    header: " Total Order ",
  },
  {
    //should have badge with different colors based on status

    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = [];
      switch (status) {
        case "stock":
          colorClass = ["bg-green-500", " text-green-500"];
          break;
        case "out of stock":
          colorClass = ["bg-red-500", " text-red-500 "];
          break;
        case "discontinued":
          colorClass = ["bg-red-800", " text-red-800 "];
          break;
      }
      return (
        <div className={`flex gap-x-1 items-center ${colorClass[1]} `}>
          <div
            className={` w-2 h-2 inline-flex text-xs font-semibold rounded-full ${colorClass[0]}`}
          ></div>

          {status}
        </div>
      );
    },
  },
  {
    // format amount to include cedi sign
    accessorKey: "price",
    header: "Price",
  },
];
