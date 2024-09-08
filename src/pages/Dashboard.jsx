import { useState } from "react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import DropdownButton from "../components/Dropdown";
import CurrentTma from "../components/CurrentTma";
import LatestData from "../components/LatestData";
import MainChart from "../components/MainChart";
import Threshold from "../assets/threshold.png";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("PSLH UGM");
  const options = ["PSLH UGM"];

  return (
    <div className="flex flex-col lg:h-screen w-full bg-gray relative">
      <header>
        <Nav />
      </header>

      <main className="flex-grow px-4 md:px-20 relative flex flex-col lg:pt-12 mt-2 pt-16">
        <div className="flex justify-between items-end lg:pt-2 pt-0">
          <h1
            className="font-bold text-xl md:text-2xl lg:text-3xl"
            id="dashboard-heading"
          >
            Dashboard
          </h1>
          <div className="pt-0">
            <DropdownButton
              options={options}
              selectedOption={selectedOption}
              onSelect={(option) => setSelectedOption(option)}
              aria-label="Select option for dashboard"
            />
          </div>
        </div>

        <section
          aria-labelledby="main-chart-heading"
          className="flex-grow flex flex-col md:flex-row mb-2"
        >
          <div className="w-full md:w-3/4">
            <h2 id="main-chart-heading" className="sr-only">
              Main Chart Section
            </h2>
            <div>
              <MainChart aria-label="Main chart displaying data" />
            </div>
          </div>

          <aside
            className="w-full md:w-1/4 md:pl-4"
            aria-labelledby="aside-heading"
          >
            <h2 id="aside-heading" className="sr-only">
              Data Information Section
            </h2>
            <div>
              <CurrentTma aria-label="Current Water Level" />
            </div>

            <div className="py-2">
              <LatestData aria-label="Latest Data" />
            </div>

            <div className="w-full border border-blue pb-2 bg-white text-center items-center">
              <img
                src={Threshold}
                alt="Threshold Water Level Indicator"
                className="items-center"
              />
              <a
                href="https://jdih.jogjaprov.go.id/hukum/peraturan-daerah-daerah-istimewa-yogyakarta-nomor-5-tahun-2012-tentang-pengelolaan-air-tanah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue underline px-2 py-1"
                aria-label="Link to regulation on water management"
              >
                Status based on the Decrease of Ground Water Level
              </a>
            </div>
          </aside>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
