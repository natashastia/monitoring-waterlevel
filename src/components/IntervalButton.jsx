import React from "react";

const IntervalButton = ({ interval, setInterval, buttonClass, children }) => {
  return (
    <button
      className={`h-9 lg:w-32 w-28 text-sm lg:ml-4 btn-transition ${buttonClass(
        interval
      )}`}
      onClick={() => setInterval(interval)}
    >
      {children}
    </button>
  );
};

export default IntervalButton;
