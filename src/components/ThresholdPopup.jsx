import React from "react";

const ThresholdPopup = ({
  thresholds,
  thresholdError,
  handleInputChange,
  handleClosePopup,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={handleClosePopup}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg z-50 min-w-[300px] min-h-[250px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg text-center font-semibold mb-4">
          Threshold Settings
        </h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Alert</h3>
          <div className="flex items-center gap-2">
            <span>-</span>
            <input
              type="number"
              value={thresholds.alert}
              onChange={(e) => handleInputChange(e, "alert")}
              placeholder="Threshold"
              className="p-2 w-full border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Critical</h3>
          <div className="flex items-center gap-2">
            <span>-</span>

            <input
              type="number"
              value={thresholds.critical}
              onChange={(e) => handleInputChange(e, "critical")}
              placeholder="Threshold"
              className="p-2 w-full border rounded"
            />
          </div>
        </div>

        {thresholdError && (
          <p className="text-red text-center">{thresholdError}</p>
        )}
      </div>
    </div>
  );
};

export default ThresholdPopup;
