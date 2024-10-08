import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Legend,
} from "recharts";
import CustomTooltip from "./customTooltip.jsx";
import { IoMdSettings } from "react-icons/io";

const ThresholdArea = ({
  handleButtonClick,
  data,
  isLoading,
  error,
  interval,
  thresholds,
}) => {
  return (
    <div className="bg-white pl-4 pr-4 pb-4 border-l-2 border-r-2 border-b-2 border-darkgray">
      <div className="flex bg-lightblue border border-blue px-2 py-1 justify-between items-center">
        <div className="flex items-center">
          <h1 className="lg:text-lg text-md font-medium">Threshold Chart</h1>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex lg:flex-row flex-col">
            <div className="flex">
              <span className="lg:w-10 w-5 lg:h-2 h-1 my-2 rounded-full bg-[#FFA500] lg:mr-2"></span>
              <span className="lg:text-base text-sm lg:ml-0 ml-2">Alert</span>
            </div>
            <div className="flex">
              <span className="lg:w-10 w-5 lg:h-2 h-1 my-2 rounded-full bg-[#FF0000] lg:mx-2"></span>
              <span className="lg:text-base text-sm lg:ml-0 ml-2">
                Critical
              </span>
            </div>
          </div>
          <button
            className="bg-blue ml-3 py-1 px-2 rounded-full text-white hover:bg-white hover:text-black 
             transition-colors duration-300 ease-in-out text-xs flex items-center"
            onClick={handleButtonClick}
          >
            <IoMdSettings className="mr-1 transition-transform duration-300" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="text-black border-l border-b border-r border-blue">
        <div className="py-2 px-3 lg:h-[23vh] h-[20vh]">
          {isLoading ? (
            <div className="h-full text-center items-center p-4">
              Loading...
            </div>
          ) : error ? (
            <div className="text-center text-red-500">Error: {error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                syncId="mainChart"
                data={data}
                margin={{ top: 20, right: 15, left: -25, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="none" vertical={false} />
                <XAxis
                  dataKey="starts_at"
                  tickFormatter={(tick) => {
                    if (interval === "hourly") {
                      return dayjs(tick).format("HH:mm");
                    } else if (interval === "daily") {
                      return dayjs(tick).format("DD/MM");
                    } else if (interval === "monthly") {
                      return dayjs(tick).format("MMMM");
                    }
                    return tick;
                  }}
                  className="xAxisChart2"
                  axisLine={true}
                  tick={false}
                  mirror={true}
                  label={{
                    value: "Ground Surface",
                    position: "top",
                    offset: -24,
                    fontSize: 10,
                  }}
                />
                <YAxis
                  domain={[0, 20]}
                  reversed
                  tickFormatter={(tick) =>
                    tick === 0 ? "0" : `-${tick.toFixed(0)}`
                  }
                  tick={{ fontSize: 10 }}
                />

                <ReferenceLine
                  y={thresholds.critical || 17}
                  stroke="#FF0000"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={thresholds.alert || 14}
                  stroke="#FFA500"
                  strokeWidth={2}
                />
                <Line
                  isAnimationActive={false}
                  connectNulls
                  type="monotone"
                  dataKey="cumulative_value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Value"
                />
                <Tooltip content={<CustomTooltip interval={interval} />} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThresholdArea;
