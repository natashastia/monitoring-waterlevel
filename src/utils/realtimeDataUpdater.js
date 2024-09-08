import { parseISO, startOfHour } from "date-fns";

export const updateCurrentDataWithRealtime = (realtimeData, currentData) => {
  const { datetime, TMA } = realtimeData;
  const parsedDate = parseISO(datetime);
  const roundedDate = startOfHour(parsedDate);
  const newFormatDate = roundedDate.toISOString();

  // Round TMA to 3 decimal places
  const roundedTMA = parseFloat(TMA).toFixed(3);

  const updatedCurrentData = [...currentData];
  const index = updatedCurrentData.findIndex(
    (data) => data.starts_at === newFormatDate
  );

  if (index !== -1) {
    updatedCurrentData[index].cumulative_value = roundedTMA;
  } else {
    updatedCurrentData.push({
      starts_at: newFormatDate,
      cumulative_value: roundedTMA,
    });
  }

  return updatedCurrentData;
};
