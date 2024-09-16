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
      <div className="flex justify-between fixed top-0 left-0 w-full z-50 text-black border-b-2 border-darkgray lg:py-2 lg:px-20 px-4 py-1 flex-1 bg-white">
        {/* Logo Section */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <FaWater size={38} color="#4880FF" />
            <div className="flex flex-col">
              <span className="lg:text-md text-sm font-bold">
                Ground Water Level
              </span>
              <span className="lg:text-sm text-xs font-medium">
                Monitoring System
              </span>
            </div>
          </Link>
        </div>

        {/* Home Icon Link */}
        <div className="lg:flex items-center hidden">
          <ul className="flex text-md">
            <NavItem to="/" label="Home" icon={<FaHome />} />
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden transition-colors duration-300 ease-in-out justify-end 
             hover:text-blue-500"
          onClick={handleClick}
        >
          {click ? (
            <FaTimes
              size={20}
              className="transition-transform duration-300 ease-in-out"
            />
          ) : (
            <IoMenu
              size={20}
              className="transition-transform duration-300 ease-in-out "
            />
          )}
        </button>

        {/* Mobile Menu */}
        {click && (
          <div
            className="lg:hidden absolute z-50 bg-white right-4 mt-14 border border-gray 
                 rounded-md shadow-lg transition-all duration-300 transform 
                 ease-in-out origin-top-right scale-100"
          >
            <ul className="text-center flex flex-col lg:text-xl p-4">
              <NavItem to="/" label="Home" />
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
