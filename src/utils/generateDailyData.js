import dayjs from "dayjs";

export const generateDailyData = (deviceData) => {
  const daysInMonth = dayjs().daysInMonth();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const date = dayjs().startOf("month").add(i, "day").format("YYYY-MM-DD");
    return {
      starts_at: date,
      cumulative_value: null,
    };
  });

  deviceData.forEach((data) => {
    const dataDate = dayjs(data.starts_at).format("YYYY-MM-DD");
    const index = dayjs(data.starts_at).date() - 1;
    dailyData[index] = {
      ...dailyData[index],
      cumulative_value: parseFloat(data.cumulative_value),
    };
  });

  return dailyData;
};
