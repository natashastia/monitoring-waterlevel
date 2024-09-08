import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import DropdownButton from "../components/Dropdown";
import Container from "../components/Container";

const Devices = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedOption, setSelectedOption] = useState("PSLH UGM");

  const options = ["PSLH UGM"];
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const url = `${baseUrl}/api/devices`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeviceData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [baseUrl, token]);

  const filteredData = deviceData.filter(
    (device) => device.organization_id === 5
  );

  if (error) return <p>Error: {error}</p>;

  const getStatusColor = (status) => {
    if (status === null) return "bg-black";
    return status ? "bg-red" : "bg-green";
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray relative">
      <header>
        <Nav />
      </header>

      <main
        className="flex-grow px-4 md:px-20 relative flex flex-col lg:pt-12 mt-2 pt-16"
        role="main"
      >
        <div className="flex justify-between items-end pt-2 pb-1">
          <h1
            className="font-bold text-xl md:text-2xl lg:text-3xl"
            id="devices-title"
          >
            Devices
          </h1>
          <DropdownButton
            options={options}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            aria-label="Select Organization"
          />
        </div>
        <section
          className="flex-grow p-4 mb-10 bg-white"
          aria-labelledby="devices-title"
        >
          {loadingData ? (
            <p>Loading...</p>
          ) : (
            <div className="max-h-[550px] overflow-y-auto" role="list">
              {filteredData.map((device) => (
                <Container
                  key={device.id}
                  title={device.name}
                  latestDatetime={device.latest_payload.datetime}
                  isConnected={device.is_connected}
                  role="listitem"
                >
                  <div className="flex justify-between">
                    <div className="my-2">
                      <h2
                        className="lg:text-xl font-medium"
                        id={`info-${device.id}`}
                      >
                        Information
                      </h2>
                      <div className="flex">
                        <div className="mt-1 mx-2 inline-block h-29 w-0.5 self-stretch bg-black"></div>
                        <ul
                          className="list-none space-y-1 mx-1"
                          aria-labelledby={`info-${device.id}`}
                        >
                          <li>Name: {device.name}</li>
                          <li>Time zone: {device.timezone}</li>
                          <li>
                            Date created:{" "}
                            {new Date(device.created_at).toLocaleDateString()}
                          </li>
                          <li>
                            Place of installation: {device.organization.name}
                          </li>
                          <li className="underline font-bold">
                            Device Condition
                          </li>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              Batt Voltage: {device.latest_payload.Batt_Voltage}{" "}
                              V
                            </li>
                            <li>
                              I Charge Current:{" "}
                              {device.latest_payload.I_Charge_Current} A
                            </li>
                            <li>
                              MCU Temp: {device.latest_payload.MCU_Temp} °C
                            </li>
                            <li>V Solar: {device.latest_payload.V_Solar} V</li>
                            <li>
                              V Step Up: {device.latest_payload.V_Step_Up} V
                            </li>
                            <li>
                              Frequency: {device.latest_payload.frequency} Hz
                            </li>
                            <li>RSSI: {device.latest_payload.rssi} dBm</li>
                            <li>SNR: {device.latest_payload.snr}</li>
                            <li>Counter: {device.latest_payload.counter}</li>
                          </ul>
                        </ul>
                      </div>
                    </div>
                    <div className="my-2 mx-2 space-y-2">
                      {[
                        {
                          label: "Read Trials",
                          status:
                            device.latest_payload.LevelTransducer_Read_Trials,
                        },
                        {
                          label: "Safemode Status",
                          status: device.latest_payload.Safemode_Status,
                        },
                        {
                          label: "Send Trials",
                          status: device.latest_payload.Send_Trials,
                        },
                        {
                          label: "Error Status",
                          status: device.latest_payload.errors,
                        },
                        { label: "Busy Status", status: device.is_busy },
                      ].map(({ label, status }) => (
                        <div
                          key={label}
                          className="h-8 lg:w-48 max-w-56 bg-white border-2 border-blue flex gap-1 p-1 items-center"
                          role="status"
                          aria-live="polite"
                        >
                          <span
                            className={`w-2 h-2 mx-2 rounded-full ${getStatusColor(
                              status
                            )}`}
                            aria-hidden="true"
                          ></span>
                          <div className="w-full text-black">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Container>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Devices;
