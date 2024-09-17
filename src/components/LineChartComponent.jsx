import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./customTooltip.jsx";
import { formatYAxisTick } from "../utils/formatYAxisTick";
import { formatXAxisTick } from "../utils/formatXAxisTick";
import { IoIosInformationCircle } from "react-icons/io";
import { getYAxisDomain } from "../utils/getYAxisDomain";
import LegendValue from "../assets/legendvalue.svg";
import LegendPreviousValue from "../assets/legendpreviousvalue.svg";

const LineChartComponent = ({
  data,
  dataPrevious,
  interval,
  isLoading,
  error,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [trend, setTrend] = useState("");
  const [showPrevious, setShowPrevious] = useState(false);
  const yAxisDomain = getYAxisDomain(
    data,
    showPrevious ? dataPrevious : [],
    interval
  );

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(
        (item) => item.cumulative_value !== null
      );

      if (filteredData.length <= 1) {
        setTrend("Can't be counted");
        return;
      }

      const midpoint = Math.floor(filteredData.length / 2);

      let firstHalf = filteredData.slice(0, midpoint);
      let secondHalf = filteredData.slice(midpoint);

      if (filteredData.length % 2 !== 0 && filteredData.length > 1) {
        const middleElement = filteredData[midpoint];
        firstHalf = [...firstHalf, middleElement];
        secondHalf = [middleElement, ...secondHalf];
      }

      const average = (arr) =>
        arr.length > 0
          ? arr.reduce((sum, item) => sum + item.cumulative_value, 0) /
            arr.length
          : 0;

      const firstHalfAverage = average(firstHalf);
      const secondHalfAverage = average(secondHalf);

      if (secondHalfAverage > firstHalfAverage) {
        setTrend("The graph shows a DOWNWARD trend");
      } else if (secondHalfAverage < firstHalfAverage) {
        setTrend("The graph shows an UPWARD trend");
      } else {
        setTrend("The graph shows a DOWNWARD trend");
      }
    }
  }, [data]);

  const handleTogglePreviousData = () => {
    setShowPrevious(!showPrevious);
  };

  return (
    <section
      className="h-full bg-white text-black p-4 border-l-2 border-r-2 border-darkgray"
      aria-labelledby="chart-heading"
    >
      <div className="flex bg-lightblue border border-blue px-2 py-1 justify-between items-center">
        <div className="flex">
          <h className="lg:text-lg text-md font-medium">Data Chart</h>
        </div>
        <div className="flex items-center">
          <div className="flex lg:flex-row flex-col justify-center lg:gap-2 gap-0 mr-2">
            <div className="flex gap-2 text-sm">
              <img
                src={LegendValue}
                className="w-8 lg:w-10"
                alt="Legend Value"
              />
              <span className="lg:text-base text-xs">Value</span>
            </div>
            {showPrevious && dataPrevious && dataPrevious.length > 0 && (
              <div className="flex gap-2">
                <img
                  src={LegendPreviousValue}
                  className="w-8 lg:w-10"
                  alt="Previous Value"
                />
                <span className="lg:text-base text-xs">Previous Value</span>
              </div>
            )}
          </div>

          {interval !== "monthly" && (
            <button
              onClick={handleTogglePreviousData}
              className="bg-blue p-1 px-3 rounded-full text-white 
                       hover:bg-white hover:text-black 
                       transition-colors duration-300 ease-in-out text-xs"
            >
              {showPrevious
                ? interval === "daily"
                  ? "Hide Last Month"
                  : "Hide Yesterday"
                : interval === "daily"
                ? "Show Last Month"
                : "Show Yesterday"}
            </button>
          )}
        </div>
      </div>
      <div className="lg:h-[33vh] h-[30vh] border-l border-r border-blue">
        {isLoading ? (
          <div
            className="h-full text-center items-center p-4"
            aria-live="polite"
          >
            Loading...
          </div>
        ) : error ? (
          <div role="alert">Error: {error}</div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            aria-label="Line chart showing cumulative value over time"
          >
            <LineChart
              data={data}
              syncId="mainChart"
              margin={{ top: 40, right: 20, left: 20, bottom: 1 }}
            >
              <CartesianGrid strokeDasharray="none" vertical={false} />
              <XAxis
                className="xAxisChart1"
                dataKey="starts_at"
                type="category"
                interval={0}
                tickFormatter={(tickItem) =>
                  formatXAxisTick(tickItem, interval)
                }
                axisLine={false}
                label={{
                  value:
                    interval === "hourly"
                      ? "Time (hours)"
                      : interval === "daily"
                      ? "Date"
                      : "Month",
                  position: "top",
                  offset: -5,
                  fontSize: 10,
                  role: "presentation",
                }}
                tick={{ fontSize: 10 }}
                mirror={true}
              />
              <YAxis
                type="number"
                reversed={true}
                domain={yAxisDomain}
                tickFormatter={(tickItem) =>
                  formatYAxisTick(tickItem, interval)
                }
                label={{
                  value: "Meters",
                  angle: -90,
                  position: "left",
                  offset: -5,
                  fontSize: 10,
                  role: "presentation",
                }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip interval={interval} />} />
              <Line
                isAnimationActive={false}
                connectNulls
                dataKey="cumulative_value"
                stroke="#8884d8"
                fill="#8884d8"
                aria-hidden="true"
                name="Value"
              />
              {showPrevious && interval !== "monthly" && (
                <Line
                  isAnimationActive={false}
                  connectNulls
                  dataKey="cumulative_value"
                  data={dataPrevious}
                  stroke="#a3aabe"
                  fill="#a3aabe"
                  name="Previous Value"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex justify-end items-center bg-white py-2 px-2 border-l border-r border-b border-blue relative">
        {isLoading ? (
          <div>Calculating trend...</div>
        ) : (
          <div className="flex text-sm lg:text-sm items-center">
            {trend}
            <IoIosInformationCircle
              className="ml-2 info-icon"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="tooltip-text1">
                Calculated with semi average method
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LineChartComponent;
