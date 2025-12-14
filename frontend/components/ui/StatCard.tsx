import { Icon } from "@iconify/react";
interface ValueProps {
  name: string;
  value: number;
  analysis?: string;
  percent?: number;
  amount?: number;
}
interface StatCardProps {
  name: string;
  value: ValueProps[];
  prev: boolean;
  amount?: number;
}

const StatCard = ({ name, value, prev, amount }: StatCardProps) => {
  return (
    <div className="col-span-12  sm:col-span-6 md:col-span-4 lg:col-span-4 bg-background rounded-md  dark:bg-gray-800 p-4  shadow-md pl-6">
      <div className="flex pb-2 font-medium text-secondary justify-between items-center">
        <p>{name}</p>
        <Icon icon="bi:three-dots-vertical" />
      </div>
      <p className="text-gray-500 text-sm">Last 7 days</p>
      <div className="flex pt-5">
        {value.map((val) =>
          value.length > 1 ? (
            <div
              key={val.name}
              className="flex items-center text-center justify-center "
            >
              <p className="pr-1">{val.name}</p>
              <p className="text-3xl font-semibold text-center text-text-color">
                ${val.value}
              </p>
              <div className="flex pl-2  items-center">
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
          ) : (
            <div
              key={val.name}
              className="flex items-center text-center justify-center "
            >
              <p className="text-3xl font-semibold text-center text-text-color">
                ${val.value}
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
          <span className="text-tertiary">({amount})</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
