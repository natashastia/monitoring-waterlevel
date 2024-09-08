import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaHome, FaWater } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

const NavItem = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <li
      className={`transition cursor-pointer hover:border-blue hover:border-b hover:text-blue py-2 ${
        isActive ? "border-blue border-b text-blue" : ""
      }`}
    >
      <Link to={to} className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    </li>
  );
};

const Nav = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  return (
    <nav>
      <div className="h-5vh flex justify-between fixed top-0 left-0 w-full z-50 text-black border-b-2 border-darkgray lg:py-3 lg:px-20 px-4 py-3 flex-1 bg-white">
        {/* Logo Section */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <FaWater size={38} color="#4880FF" />
            <div className="flex flex-col">
              <span className="lg:text-[16px] font-bold">
                Ground Water Level
              </span>
              <span className="lg:text-[14px] font-medium">
                Monitoring System
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="lg:flex items-center justify-center hidden">
          <ul className="flex gap-8 text-[17px]">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/fields" label="Fields" />
            <NavItem to="/devices" label="Devices" />
            <NavItem to="/data" label="Data" />
          </ul>
        </div>

        {/* Home Icon Link */}
        <div className="lg:flex items-center hidden">
          <ul className="flex text-[17px]">
            <NavItem to="/" label="Home" icon={<FaHome />} />
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden transition justify-end"
          onClick={handleClick}
        >
          {click ? <FaTimes size={20} /> : <IoMenu size={20} />}
        </button>

        {/* Mobile Menu */}
        {click && (
          <div className="lg:hidden absolute z-50 bg-white right-4 mt-14 border border-gray rounded-md shadow-lg">
            <ul className="text-center flex flex-col lg:text-xl p-4">
              <NavItem to="/dashboard" label="Dashboard" />
              <NavItem to="/fields" label="Fields" />
              <NavItem to="/devices" label="Devices" />
              <NavItem to="/data" label="Data" />
              <NavItem to="/" label="Home" />
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
