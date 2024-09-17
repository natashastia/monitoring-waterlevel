import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import DropdownButton from "../components/Dropdown";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa6";
import { generateCsvData } from "../utils/generateCsvData";
import Table from "../components/Table.jsx";
import {
  calculatePercentageChanges,
  calculateAllPercentageChanges,
} from "../utils/calculatePercentage";

const Data = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("all");
  const [loadingData, setLoadingData] = useState(false);
  const [selectedFields, setSelectedFields] = useState("PSLH UGM");

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;
  const deviceId = 79;

  const fetchAllPages = async (url) => {
    let allData = [];
    let nextPage = url;

    while (nextPage) {
      try {
        const response = await axios.get(nextPage, {
          headers: { Authorization: `Bearer ${token}` },
        });
        allData = [...allData, ...response.data.data];
        nextPage = response.data.links.next;
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        nextPage = null;
      }
    }

    return allData;
  };

  const fetchPage = async (url, page = 1) => {
    const pageUrl = `${url}&page=${page}`;

    try {
      const response = await axios.get(pageUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      let url;
      let allDeviceData = [];

      if (interval === "all") {
        url = `${baseUrl}/api/devices/${deviceId}/energies?sort_by=created_at&order_by=desc`;
        try {
          allDeviceData = await fetchAllPages(url);
        } catch (err) {
          setError(err.message);
        }
      } else {
        url = `${baseUrl}/api/devices/${deviceId}/energies?interval=${interval}&sort_by=created_at&order_by=desc`;
        try {
          const [firstPageData, secondPageData] = await Promise.all([
            fetchPage(url, 1),
            fetchPage(url, 2),
          ]);
          allDeviceData = [...firstPageData, ...secondPageData];
        } catch (err) {
          setError(err.message);
        }
      }

      setDeviceData(allDeviceData);
      setLoadingData(false);
    };

    fetchData();
  }, [interval]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sortedData =
        interval === "all"
          ? deviceData
          : [...deviceData].sort(
              (a, b) => new Date(b.starts_at) - new Date(a.starts_at)
            );
      setFilteredData(sortedData);
    }, 500);

    return () => clearTimeout(timer);
  }, [deviceData, interval]);

  if (error) return <p>Error: {error}</p>;

  const buttonClass = (btnInterval) =>
    interval === btnInterval
      ? "bg-blue text-white"
      : "bg-lightblue hover:bg-blue hover:text-white";

  const DataButton = ({ interval: btnInterval, label }) => (
    <button
      onClick={() => {
        setInterval(btnInterval);
        setLoadingData(true);
      }}
      className={`py-2 px-2 lg:w-32 ${buttonClass(btnInterval)} btn-transition`}
      aria-label={`Show ${label}`}
      disabled={interval === btnInterval}
    >
      {label}
    </button>
  );

  const intervalTitleMap = {
    all: "All",
    hourly: "Hourly",
    daily: "Daily",
    monthly: "Monthly",
  };

  const title = intervalTitleMap[interval] || "Data";
  const percentageChanges = calculatePercentageChanges(filteredData);
  const csvData = generateCsvData(filteredData, interval, percentageChanges);

  return (
    <div className="flex flex-col h-screen w-full bg-gray relative">
      <header>
        <Nav />
      </header>

      <main
        className="flex-grow px-4 md:px-20 relative flex flex-col lg:pt-12 mt-2 pt-16"
        role="main"
      >
        <div className="hidden lg:block">
          <div className="flex pt-4 items-end justify-between">
            <h1
              className="font-bold text-lg pb-1 md:text-xl lg:text-2xl"
              id="data-title"
            >
              Data
            </h1>
            <div className="space-x-4 text-center items-center">
              <DataButton interval="all" label="All Data" />
              <DataButton interval="hourly" label="Hourly Data" />
              <DataButton interval="daily" label="Daily Data" />
              <DataButton interval="monthly" label="Monthly Data" />
            </div>
          </div>
        </div>

        <div className="block lg:hidden pt-2 justify-between">
          <div className="flex justify-between">
            <h1
              className="font-bold text-xl md:text-2xl lg:text-3xl"
              id="data-title-mobile"
            >
              Data
            </h1>
          </div>
          <div className="flex flex-row text-center justify-between pt-1 items-center">
            <DataButton interval="all" label="All Data" />
            <DataButton interval="hourly" label="Hourly Data" />
            <DataButton interval="daily" label="Daily Data" />
            <DataButton interval="monthly" label="Monthly Data" />
          </div>
        </div>

        <section
          className="flex-grow mb-10 border-t-4 border-blue border"
          aria-labelledby="data-title"
        >
          <div className="flex justify-between mx-4 mt-2 mb-2">
            <CSVLink
              data={csvData}
              filename={`data_${interval}.csv`}
              className="mx-2 text-sm flex items-center"
              aria-label="Download data as CSV"
            >
              <FaDownload aria-hidden="true" />
              <span className="ml-2">Download Data (.csv)</span>
            </CSVLink>
          </div>

          <div
            className="mx-4 table-container lg:h-[550px] h-[510px]"
            role="region"
            aria-labelledby="tma-data-title"
          >
            {loadingData ? (
              <div
                className="flex items-center justify-center"
                aria-busy="true"
                aria-live="polite"
              >
                <p>Loading...</p>
              </div>
            ) : (
              <Table
                data={filteredData}
                interval={interval}
                aria-label={`Table showing ${title} data`}
              />
            )}
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Data;
