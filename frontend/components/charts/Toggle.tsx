import { usePreriod } from "./stores/usePeriod";

const Toggle = () => {
  const { activeTab, setActiveTab, period } = usePreriod();
  console.log("toggle rendered");

  return (
    <div className="bg-accent rounded-full p-1 inline-flex">
      <button
        onClick={() => setActiveTab("this")}
        className={`
            px-4 py-2 rounded-full capitalize text-sm font-medium
            transition-all duration-300 ease-in-out
            ${
              activeTab === "this"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
      >
        {period === "all" ? "" : "This"} {period}{" "}
        {period === "all" ? "time" : ""}
      </button>
      <button
        disabled={period === "all"}
        onClick={() => setActiveTab("last")}
        className={`
         ${period === "all" ? "cursor-not-allowed opacity-50 hidden " : ""}
            px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-300 ease-in-out
            ${
              activeTab === "last"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
      >
        Last {period}
      </button>
    </div>
  );
};

export default Toggle;
