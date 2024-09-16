import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import LineChartComponent from "./LineChartComponent.jsx";
import ThresholdArea from "./ThresholdArea.jsx";
import ThresholdPopup from "./ThresholdPopup.jsx";
import IntervalButton from "./IntervalButton.jsx";
import { generateHourlyPrevious } from "../utils/generateHourlyPrevious";
import { generateDailyPrevious } from "../utils/generateDailyPrevious";
import { validateThresholds } from "../utils/validateThreshold";
import { fetchDeviceData } from "../utils/dataService";
import { generateCurrentData } from "../utils/dataGenerators";
import { initializePusher, subscribeToChannel } from "../utils/pusherService";
import { updateCurrentDataWithRealtime } from "../utils/realtimeDataUpdater";

const MainChart = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("hourly");
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [realtimeData, setRealtimeData] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [thresholds, setThresholds] = useState({
    alert: "",
    critical: "",
  });
  const [thresholdError, setThresholdError] = useState("");

  const pusherRef = useRef(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;
  const device_id = 79;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { filteredData, filteredDataPrevious } = await fetchDeviceData(
          baseUrl,
          device_id,
          interval,
          token
        );

        setPreviousData(filteredDataPrevious);
        setDeviceData(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interval]);

  useEffect(() => {
    const generatedData = generateCurrentData(interval, deviceData);
    setCurrentData(generatedData);
  }, [deviceData, interval]);

  const dataPrevious =
    interval === "hourly"
      ? generateHourlyPrevious(previousData)
      : interval === "daily"
      ? generateDailyPrevious(previousData)
      : [];

  useEffect(() => {
    if (realtimeData) {
      const updatedCurrentData = updateCurrentDataWithRealtime(
        realtimeData,
        currentData
      );

      setCurrentData([...updatedCurrentData]);
    }
  }, [realtimeData]);

  useEffect(() => {
    pusherRef.current = initializePusher();
    const channel = subscribeToChannel(pusherRef.current, setRealtimeData);
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const today = dayjs();
  const formattedDate = today.format("dddd, DD MMMM YYYY");
  const formattedTime = today.format("HH:mm");

  const intervals = [
    { interval: "hourly", label: "Today" },
    { interval: "daily", label: "This Month" },
    { interval: "monthly", label: "This Year" },
  ];

  const buttonClass = (btnInterval) =>
    interval === btnInterval
      ? "bg-blue text-white"
      : "bg-lightblue hover:bg-blue hover:text-white";

  const handleButtonClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleClosePopup = () => {
    if (
      thresholdError === "The critical value must be greater than alert ⚠️" ||
      thresholdError === "The critical value is too large ⚠️" ||
      thresholdError === "Both alert and critical values are required ⚠️" ||
      thresholdError === "Both alert and critical values must be numbers ⚠️"
    ) {
      return;
    }
    setPopupVisible(false);
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;

    setThresholds((prevState) => {
      const updatedThresholds = {
        ...prevState,
        [type]: value,
      };

      const validationError = validateThresholds(updatedThresholds);
      setThresholdError(validationError);

      if (!validationError) {
        localStorage.setItem("thresholds", JSON.stringify(updatedThresholds));
      }

      return updatedThresholds;
    });
  };

  useEffect(() => {
    const storedThresholds = localStorage.getItem("thresholds");
    if (storedThresholds) {
      setThresholds(JSON.parse(storedThresholds));
    }
  }, []);

  return (
    <div className="h-grow">
      <div className="lg:flex md:flex justify-between">
        <h1 className="lg:text-lg text-center text-sm font-bold mt-1 lg:pr-0">
          TMA Data
        </h1>
        <div className="flex justify-between text-center  items-center">
          {intervals.map(({ interval, label }) => (
            <IntervalButton
              key={interval}
              interval={interval}
              setInterval={setInterval}
              buttonClass={buttonClass}
            >
              {label}
            </IntervalButton>
          ))}
        </div>
      </div>
      <div className="border-t-4 border-blue">
        <div>
          <LineChartComponent
            data={currentData}
            dataPrevious={dataPrevious}
            interval={interval}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
            isLoading={isLoading}
            error={error}
          />
          <ThresholdArea
            handleButtonClick={handleButtonClick}
            data={currentData}
            isLoading={isLoading}
            error={error}
            interval={interval}
            thresholds={thresholds}
          />
          {isPopupVisible && (
            <ThresholdPopup
              thresholds={thresholds}
              thresholdError={thresholdError}
              handleInputChange={handleInputChange}
              handleClosePopup={handleClosePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChart;
