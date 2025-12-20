import React from "react";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Icon } from "@iconify/react";

const AddProduct = () => {
  return (
    <aside className="min-h-[200px] gap-y-5 py-5 px-5 col-span-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between mb-5 items-center">
        {" "}
        Add NewProduct{" "}
        <Button className="bg-transparent hover:bg-transparent hover:text-[#6467F2]/70 text-[#6467F2] cursor-pointer">
          <PlusCircleIcon className="h-5 w-5" />
          Add New
        </Button>
      </div>

      {/* Categories */}
      <div className="w-full py-4 cursor-pointer px-4 rounded-lg flex justify-between items-center shadow-md border-t border-t-gray-100">
        <div className="">Electronics</div>

        <Icon icon="teenyicons:right-outline" />
      </div>
    </aside>
  );
};

export default AddProduct;
