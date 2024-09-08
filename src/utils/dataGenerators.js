import { generateHourlyData } from "./generateHourlyData";
import { generateDailyData } from "./generateDailyData";
import { generateMonthlyData } from "./generateMonthlyData";
import { generateHourlyPrevious } from "./generateHourlyPrevious";
import { generateDailyPrevious } from "./generateDailyPrevious";

export const generateCurrentData = (interval, deviceData) => {
  if (interval === "hourly") return generateHourlyData(deviceData);
  if (interval === "daily") return generateDailyData(deviceData);
  if (interval === "monthly") return generateMonthlyData(deviceData);
  return [];
};

export const generatePreviousData = (interval, previousData) => {
  if (interval === "hourly") return generateHourlyPrevious(previousData);
  if (interval === "daily") return generateDailyPrevious(previousData);
  return [];
};
