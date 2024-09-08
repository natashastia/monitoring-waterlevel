import dayjs from "dayjs";

export const generateMonthlyData = (deviceData) => {
  const monthsInYear = 12;
  const monthlyData = Array.from({ length: monthsInYear }, (_, i) => {
    const date = dayjs().startOf("year").add(i, "month").format("YYYY-MM");
    return {
      starts_at: date,
      cumulative_value: null,
    };
  });

  deviceData.forEach((data) => {
    const dataMonth = dayjs(data.starts_at).format("YYYY-MM");
    const index = dayjs(data.starts_at).month();
    monthlyData[index] = {
      ...monthlyData[index],
      cumulative_value: parseFloat(data.cumulative_value),
    };
  });

  return monthlyData;
};
