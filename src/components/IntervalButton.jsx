import React from "react";

const IntervalButton = ({ interval, setInterval, buttonClass, children }) => {
  return (
    <button
      className={`lg:py-2 py-1 lg:w-36 w-28 lg:ml-4 ml-4 btn-transition ${buttonClass(
        interval
      )}`}
      onClick={() => setInterval(interval)}
    >
      {children}
    </button>
  );
};

export default IntervalButton;
