import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { processedData } from "../utils/processedData";
import { calculatePercentageChanges } from "../utils/calculatePercentage";
import { initializePusher, subscribeToChannel } from "../utils/pusherService";

const LatestData = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Hourly");
  const [deviceData, setDeviceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("hourly");
  const [loadingData, setLoadingData] = useState(false);

  const pusherRef = useRef(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;
  const device_id = 79;

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const url = `${baseUrl}/api/devices/${device_id}/energies?interval=${interval}&sort_by=created_at&order_by=desc`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeviceData(response.data.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoadingData(false);
    }
  }, [interval, baseUrl, token, device_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const sortedData = [...deviceData].sort(
      (a, b) => new Date(b.starts_at) - new Date(a.starts_at)
    );
    setFilteredData(sortedData);
  }, [deviceData]);

  useEffect(() => {
    if (interval === "hourly") {
      pusherRef.current = initializePusher();
      const channel = subscribeToChannel(pusherRef.current, (realtimeData) => {
        if (realtimeData) {
          const datetime = new Date(realtimeData.datetime);

          datetime.setMinutes(0, 0, 0);

          const formattedTime = datetime
            .toISOString()
            .replace(/\.\d{3}Z$/, "+00:00");

          const formattedTMA = parseFloat(realtimeData.TMA).toFixed(3);

          const newRealtimeData = {
            starts_at: formattedTime,
            cumulative_value: formattedTMA,
          };

          setDeviceData((prevData) => {
            let sortedPrevData = [...prevData].sort(
              (a, b) => new Date(b.starts_at) - new Date(a.starts_at)
            );

            const existingDataIndex = sortedPrevData.findIndex(
              (data) => data.starts_at === formattedTime
            );

            if (existingDataIndex > -1) {
              sortedPrevData[existingDataIndex] = {
                ...sortedPrevData[existingDataIndex],
                cumulative_value: formattedTMA,
              };
            } else {
              sortedPrevData = [newRealtimeData, ...sortedPrevData];
            }

            return sortedPrevData.sort(
              (a, b) => new Date(b.starts_at) - new Date(a.starts_at)
            );
          });
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [interval]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = useCallback((option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setInterval(option.toLowerCase());
  }, []);

  const options = ["Hourly", "Daily", "Monthly"];
  const data = processedData(filteredData);
  const percentageChanges = calculatePercentageChanges(filteredData);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="border-2 border-darkgray bg-white">
      <div className="flex justify-between bg-blue items-center">
        <h1 className="p-1 mx-1 lg:text-lg text-white font-medium">
          Latest Data
        </h1>
        <div className="relative inline-block text-left p-1 items-center">
          <button
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-haspopup="true"
            className="flex items-center bg-white px-2 mx-1 text-sm rounded-full focus:outline-none
             hover:bg-lightblue hover:text-black transition-colors duration-300 ease-in-out"
          >
            {selectedOption}
            <IoIosArrowDropdownCircle
              className={`dropdown-icon transition-transform duration-300 ease-in-out 
                ${isOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>
          {isOpen && (
            <div
              className={`absolute z-50 right-0 mt-2 w-32 bg-white border border-gray rounded-md shadow-lg 
                transition-all duration-300 transform origin-top-right
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="block px-2 py-1 w-32 text-black text-center 
                   hover:bg-lightblue hover:text-black 
                   transition-colors duration-200 ease-in-out"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white table-container lg:h-[39vh] md:h-[50vh] h-[60vh]">
        {loadingData ? (
          <div className="flex items-center text-xs justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <table className="w-full table-auto text-xs">
            <thead>
              <tr>
                <th className="py-1 bg-lightblue">Date</th>
                {interval === "hourly" && (
                  <th className="py-1 bg-lightblue">Time</th>
                )}
                <th className="py-1 bg-lightblue">TMA</th>
                <th className="py-1 bg-lightblue">Changes</th>
                <th className="py-1 bg-lightblue">Status</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {data.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="text-center border-r border-lightblue">
                    {formatDate(item.starts_at)}
                  </td>
                  {interval === "hourly" && (
                    <td className="text-center border-r border-lightblue">
                      {formatTime(item.starts_at)}
                    </td>
                  )}
                  <td className="text-center border-r border-lightblue">
                    -{parseFloat(item.cumulative_value).toFixed(3)}
                  </td>
                  <td className="text-center border-r border-lightblue">
                    {percentageChanges[index]
                      ? `${percentageChanges[index].sign}${percentageChanges[
                          index
                        ].change.toFixed(2)}%`
                      : "-"}
                  </td>
                  <td
                    className="text-center border-r border-lightblue"
                    style={{
                      color: percentageChanges[index]?.color || "green",
                    }}
                  >
                    {percentageChanges[index]
                      ? percentageChanges[index].category
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LatestData;
