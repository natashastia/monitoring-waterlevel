import dayjs from "dayjs";

export const generateHourlyPrevious = (previousData) => {
  const startOfYesterday = dayjs().subtract(1, "day").startOf("day");
  const endOfYesterday = dayjs().subtract(1, "day").endOf("day");

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const date = startOfYesterday.set("hour", i).toISOString();
    return {
      starts_at: date,
      cumulative_value: null,
    };
  });

  previousData.forEach((data) => {
    const dataHour = dayjs(data.starts_at).hour();
    if (dataHour >= 0 && dataHour < 24) {
      hourlyData[dataHour] = {
        ...hourlyData[dataHour],
        cumulative_value: parseFloat(data.cumulative_value),
      };
    }
  });

  return hourlyData;
};
