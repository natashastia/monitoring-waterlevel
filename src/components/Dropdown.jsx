import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";

const DropdownButton = ({ options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prevState) => !prevState);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left p-1 mt-2">
      <div className="flex">
        <div className="flex bg-white border border-blue rounded-l-lg items-center p-2">
          <FaBuilding color="#5481FF" size={21} />
        </div>
        <button
          onClick={handleToggle}
          className="flex items-center lg:pr-4 lg:py-2 pr-2 pl-2 py-0 lg:text-base text-sm bg-blue text-white rounded-l border-y border-r border-blue rounded-full focus:outline-none"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {selectedOption}
          <IoIosArrowDropdownCircle className="dropdown-icon" />
        </button>
      </div>
      <ul
        className={`absolute z-20 right-0 mt-2 w-48 bg-white border border-gray rounded-md shadow-lg dropdown-menu ${
          isOpen ? "open" : ""
        }`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {options.map((option, index) => (
          <li key={index} role="menuitem">
            <button
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-black hover:bg-gray w-full text-left"
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownButton;
