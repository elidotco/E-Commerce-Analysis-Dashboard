import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const FilterButton = ({ values }: { values: string[] }) => {
  return (
    <Select>
      <SelectTrigger className="bg-primary border-none cursor-pointer text-white">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        {/* Add SelectItem components here for filter options */}
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterButton;
