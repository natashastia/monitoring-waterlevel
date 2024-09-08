import { formatDate } from "./formatDate";
import { formatTime } from "./formatTime";
import { formatDuration } from "./formatDuration";

export const generateCsvData = (filteredData, interval, percentageChanges) => {
  return filteredData.map((data, index) => ({
    ID: data.id,
    Devices: data.device_id === 79 ? "Device 1" : data.device_id,
    Interval: data.interval,
    Key: data.payload_key,
    Value: data.cumulative_value,
    Changes: percentageChanges[index]
      ? `${percentageChanges[index].sign}${percentageChanges[
          index
        ].change.toFixed(2)}%`
      : "-",
    Status: percentageChanges[index] ? percentageChanges[index].category : "-",
    Date: formatDate(data.starts_at),
    Time: interval === "hourly" ? formatTime(data.starts_at) : "",
    Duration: formatDuration(data.created_at, data.updated_at),
  }));
};
