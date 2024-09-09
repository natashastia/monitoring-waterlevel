import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import DropdownButton from "../components/Dropdown";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [-7.775616, 110.3792201];

const Fields = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All Fields");

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const url = `${baseUrl}/api/fields?load_total_energy=daily.tma`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeviceData(response.data.data);
        setFilteredData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [baseUrl, token]);

  useEffect(() => {
    setLoadingMap(true);
    const timer = setTimeout(() => {
      if (selectedOption === "PSLH UGM") {
        setFilteredData(deviceData.filter((item) => item.id === 5));
      } else {
        setFilteredData(deviceData);
      }
      setLoadingMap(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedOption, deviceData]);

  if (error) return <p>Error: {error}</p>;

  const options = ["All Fields", "PSLH UGM"];

  const mapCenter =
    filteredData.length > 0
      ? [
          filteredData[0].latitude ?? defaultCenter[0],
          filteredData[0].longitude ?? defaultCenter[1],
        ]
      : defaultCenter;

  return (
    <div className="flex flex-col h-screen w-full bg-gray relative">
      <header>
        <Nav />
      </header>

      <main className="flex-grow px-4 md:px-20 relative flex flex-col lg:pt-12 mt-2 pt-16">
        <div className="flex justify-between items-end pt-2 pb-1">
          <h1
            className="font-bold text-xl md:text-2xl lg:text-3xl"
            id="fields-heading"
          >
            Fields
          </h1>
          <div>
            <DropdownButton
              options={options}
              selectedOption={selectedOption}
              onSelect={(option) => setSelectedOption(option)}
              aria-label="Select field option"
            />
          </div>
        </div>
        {loadingData ? (
          <div
            className="flex items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <p>Loading data...</p>
          </div>
        ) : (
          <section
            aria-labelledby="map-heading"
            className="flex-grow pb-1 relative z-0"
          >
            <h2 id="map-heading" className="sr-only">
              Map showing field locations and energy values
            </h2>
            <MapContainer
              center={mapCenter}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: "95%", width: "100%" }}
              aria-label="Map displaying field locations"
            >
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {loadingMap && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
                  role="status"
                  aria-live="polite"
                >
                  <p>Loading map...</p>
                </div>
              )}
              {!loadingMap &&
                filteredData.map((field) => (
                  <Marker
                    key={field.id}
                    position={[
                      field.latitude ?? defaultCenter[0],
                      field.longitude ?? defaultCenter[1],
                    ]}
                    aria-label={`Field ${field.name}, Value: ${parseFloat(
                      field.total_energy
                    )}`}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    <Popup>
                      {field.name}, Value: {parseFloat(field.total_energy)}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </section>
        )}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Fields;
