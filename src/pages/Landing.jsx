import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaArrowRight } from "react-icons/fa"; // Importing icons from react-icons
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import Wave from "../assets/Wave.png";

const Landing = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(""); // State for selected organization

  const handleSelectChange = (event) => {
    setOrganization(event.target.value); // Update the selected organization
  };

  const handleNavigate = () => {
    if (organization === "Building") {
      navigate("/dashboard"); // Navigate to the dashboard when "Building" is selected
    } else {
      alert("Please select an organization first."); // Alert if no organization is selected
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray relative">
      <header>
        <Nav />
      </header>

      <main
        className="flex-grow px-16 bg-no-repeat bg-bottom relative flex flex-col pt-28"
        style={{ backgroundImage: `url(${Wave})` }}
        role="main"
      >
        <div
          className="absolute inset-0 opacity-40 z-0"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 lg:pt-20 pt-16">
          <h1
            className="lg:text-4xl md:text-3xl text-2xl px-12 font-bold text-center"
            id="landing-title"
          >
            Ground Water Level Monitoring System
          </h1>
          <div className="flex flex-col mt-2 justify-center items-center">
            <p
              className="text-center lg:text-lg md:text-md text-sm"
              id="landing-description"
            >
              Welcome! Our system offers data visualization to monitor
              groundwater levels with ease.
            </p>

            <div className="flex items-center space-x-1 mt-4">
              <div className="relative inline-block">
                <select
                  value={organization}
                  onChange={handleSelectChange}
                  className="appearance-none bg-blue text-white w-50 h-10 px-3 pr-10 rounded-l-full border-2 border-blue shadow-sm focus:outline-none"
                  aria-label="Select Organization"
                >
                  <option value="" disabled className="text-black bg-white">
                    Select Organization
                  </option>
                  <option value="Building" className="text-white">
                    PSLH UGM
                  </option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <FaChevronDown className="text-white" />
                </span>
              </div>

              <button
                onClick={handleNavigate} // Trigger navigation on button click
                className="bg-blue text-white pr-1 h-10  rounded-r-full hover:bg-blue-800"
                aria-label="Go to dashboard"
              >
                <FaArrowRight className="mx-3" size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Landing;
