import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { formatDuration } from "../utils/formatDuration";
import { calculateAllPercentageChanges } from "../utils/calculatePercentage";

const Table = ({ data, interval }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "default",
  });

  useEffect(() => {
    const percentageChanges = calculateAllPercentageChanges(data);

    const combinedData = data.map((item, index) => ({
      ...item,
      percentageChange: percentageChanges[index] || {
        change: 0,
        sign: "",
        category: "-",
        color: "green",
      },
    }));

    let sortableData = [...combinedData];
    if (sortConfig.key !== null && sortConfig.direction !== "default") {
      sortableData.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "duration") {
          aValue = convertDurationToMilliseconds(a.created_at, a.updated_at);
          bValue = convertDurationToMilliseconds(b.created_at, b.updated_at);
        } else if (sortConfig.key === "date") {
          aValue = new Date(a.starts_at).getTime();
          bValue = new Date(b.starts_at).getTime();
        } else if (sortConfig.key === "percentageChange") {
          aValue = a.percentageChange.change;
          bValue = b.percentageChange.change;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortableData);
  }, [data, sortConfig]);

  const convertDurationToMilliseconds = (startString, endString) => {
    const startDate = new Date(startString);
    const endDate = new Date(endString);
    return Math.abs(endDate - startDate);
  };

  const onSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = "default";
      } else {
        direction = "ascending";
      }
    } else {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    } else if (sortConfig.direction === "descending") {
      return <FaSortDown />;
    } else {
      return <FaSort />;
    }
  };

  return (
    <table
      className="w-full text-sm lg:text-base table-auto"
      style={{ tableLayout: "fixed" }}
      aria-label="Data Table"
    >
      <thead>
        <tr>
          <th
            scope="col"
            className="py-2 text-white w-16 cursor-pointer"
            onClick={() => onSort("id")}
          >
            <div className="flex items-center justify-center">
              <span>ID</span> {renderSortIcon("id")}
            </div>
          </th>
          <th scope="col" className="py-2 text-white w-32">
            <div className="flex items-center justify-center">
              <span>Devices</span>
            </div>
          </th>
          <th
            scope="col"
            className="py-2 text-white w-24 cursor-pointer"
            onClick={() => onSort("interval")}
          >
            <div className="flex items-center justify-center">
              <span>Interval</span> {renderSortIcon("interval")}
            </div>
          </th>
          <th scope="col" className="py-2 text-white w-24">
            <div className="flex items-center justify-center">
              <span>Key</span>
            </div>
          </th>
          <th
            scope="col"
            className="py-2 text-white w-32 cursor-pointer"
            onClick={() => onSort("cumulative_value")}
          >
            <div className="flex items-center justify-center">
              <span>Value</span> {renderSortIcon("cumulative_value")}
            </div>
          </th>
          <th
            scope="col"
            className="py-2 text-white w-32 cursor-pointer"
            onClick={() => onSort("percentageChange")}
          >
            <div className="flex items-center justify-center">
              <span>Changes</span> {renderSortIcon("percentageChange")}
            </div>
          </th>
          <th
            scope="col"
            className="py-2 text-white w-24 cursor-pointer"
            onClick={() => onSort("category")}
          >
            <div className="flex items-center justify-center">
              <span>Status</span> {renderSortIcon("category")}
            </div>
          </th>
          <th
            scope="col"
            className="py-2 text-white w-32 cursor-pointer"
            onClick={() => onSort("date")}
          >
            <div className="flex items-center justify-center">
              <span>Date</span> {renderSortIcon("date")}
            </div>
          </th>

          {(interval === "hourly" || interval === "all") && (
            <th scope="col" className="py-2 text-white w-24">
              <div className="flex items-center justify-center">
                <span>Time</span>
              </div>
            </th>
          )}
          <th
            scope="col"
            className="py-2 text-white w-32 cursor-pointer"
            onClick={() => onSort("duration")}
          >
            <div className="flex items-center justify-center">
              <span>Duration</span> {renderSortIcon("duration")}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <tr key={item.id} className="bg-white">
            <td className="p-2 border text-center" role="cell">
              {item.id}
            </td>
            <td className="p-2 border text-center" role="cell">
              {item.device_id === 79 ? "Device 1" : item.device_id}
            </td>
            <td className="p-2 border text-center" role="cell">
              {item.interval}
            </td>
            <td className="p-2 border text-center" role="cell">
              {item.payload_key}
            </td>
            <td className="p-2 border text-center" role="cell">
              -{item.cumulative_value}
            </td>
            <td className="p-2 border text-center" role="cell">
              {item.percentageChange
                ? `${
                    item.percentageChange.sign
                  }${item.percentageChange.change.toFixed(2)}%`
                : "-"}
            </td>
            <td
              className="p-2 border border-black text-center"
              style={{
                color: item.percentageChange?.color || "green",
              }}
              role="cell"
            >
              {item.percentageChange ? item.percentageChange.category : "-"}
            </td>
            <td className="p-2 border text-center" role="cell">
              <time dateTime={item.starts_at}>
                {formatDate(item.starts_at)}
              </time>
            </td>
            {(interval === "hourly" || interval === "all") && (
              <td className="p-2 border text-center" role="cell">
                <time dateTime={item.starts_at}>
                  {formatTime(item.starts_at)}
                </time>
              </td>
            )}
            <td className="p-2 border text-center" role="cell">
              {formatDuration(item.created_at, item.updated_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
