import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import waterlevel from "../assets/waterlevel.svg";
import { initializePusher, subscribeToChannel } from "../utils/pusherService";

const CurrentTma = ({ selectedOption }) => {
  const [tmaValue, setTmaValue] = useState(0);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const pusherRef = useRef(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const url = `${baseUrl}/api/devices`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredData = response.data.data.filter(
          (device) => device.organization_id === 5
        );

        if (filteredData.length > 0) {
          const latestPayload = filteredData[0].latest_payload;
          setTmaValue(latestPayload.TMA);
        } else {
          setError("No data found for the selected organization");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [baseUrl, token, selectedOption]);

  useEffect(() => {
    pusherRef.current = initializePusher();

    const channel = subscribeToChannel(pusherRef.current, (realtimeData) => {
      if (realtimeData && realtimeData.TMA !== undefined) {
        setTmaValue(realtimeData.TMA);
      } else {
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <article className="border-2 border-darkgray h-full bg-white">
      <header className="py-1 bg-blue lg:text-lg font-medium text-white text-center">
        Current TMA
      </header>
      <div>
        <div className="flex">
          <figure className="bg-gray">
            <img src={waterlevel} className="p-4" alt="Water level diagram" />
          </figure>
          <div className="flex flex-col items-center justify-center w-full">
            {!error && !loadingData && (
              <>
                <h1
                  className="font-medium lg:text-5xl md:text-3xl text-5xl"
                  aria-live="polite"
                >
                  {tmaValue.toFixed(3)}
                </h1>
                <figcaption className="text-center text-xs ">
                  Meters below the ground surface
                </figcaption>
              </>
            )}
            {error && (
              <p role="alert" className="text-red-500">
                {error}
              </p>
            )}
            {loadingData && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CurrentTma;
