export const generateHourlyData = (deviceData) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(today);
    date.setHours(i);
    return {
      starts_at: date.toISOString(),
      cumulative_value: null,
    };
  });

  deviceData.forEach((data) => {
    const dataHour = new Date(data.starts_at).getHours();
    hourlyData[dataHour] = {
      ...hourlyData[dataHour],
      cumulative_value: parseFloat(data.cumulative_value),
    };
  });

  return hourlyData;
};
