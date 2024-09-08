import dayjs from "dayjs";

export const generateDailyPrevious = (previousData) => {
  const startOfLastMonth = dayjs().subtract(1, "month").startOf("month");
  const endOfLastMonth = dayjs().subtract(1, "month").endOf("month");

  const daysInLastMonth = endOfLastMonth.date();
  const dailyData = Array.from({ length: daysInLastMonth }, (_, i) => {
    const date = startOfLastMonth.add(i, "day").format("YYYY-MM-DD");
    return {
      starts_at: date,
      cumulative_value: null,
    };
  });

  previousData.forEach((data) => {
    const dataDate = dayjs(data.starts_at).format("YYYY-MM-DD");
    const index = dayjs(data.starts_at).date() - 1;
    if (index >= 0 && index < daysInLastMonth) {
      dailyData[index] = {
        ...dailyData[index],
        cumulative_value: parseFloat(data.cumulative_value),
      };
    }
  });

  return dailyData;
};
