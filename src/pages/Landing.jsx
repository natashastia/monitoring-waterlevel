import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import Wave from "../assets/Wave.png";

const Landing = () => {
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
            className="lg:text-5xl md:text-4xl text-3xl px-12 font-bold text-center"
            id="landing-title"
          >
            Ground Water Level Monitoring System
          </h1>
          <div className="flex flex-col mt-2 justify-center items-center">
            <p
              className="text-center lg:px-72 md:px-56 px-6 lg:text-lg md:text-md text-sm"
              id="landing-description"
            >
              Welcome to the Water Level Monitoring System! Our system offers
              data visualization to monitor and manage groundwater levels with
              precision and ease.
            </p>
            <Link to="/dashboard">
              <button
                className="btn-transition mt-4 bg-blue shadow text-white w-36 px-4 py-2 lg:text-xl font-bold rounded-full hover:bg-blue-800"
                aria-label="Get Started with the Ground Water Level Monitoring System"
              >
                Get Started
              </button>
            </Link>
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
