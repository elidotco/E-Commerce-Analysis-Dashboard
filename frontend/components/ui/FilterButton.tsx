import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterButton = () => {
  return (
    // placeholder text shold be white
    <Select>
      <SelectTrigger className="bg-primary text-white border-none">
        <SelectValue placeholder="Filter" />
        {/* Icon */}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterButton;
