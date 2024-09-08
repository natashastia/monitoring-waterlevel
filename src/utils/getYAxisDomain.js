export const getYAxisDomain = (data, dataPrevious, interval, showPrevious) => {
  const values = [
    ...data.map((d) => d.cumulative_value).filter((v) => v !== null),
    ...(showPrevious
      ? dataPrevious.map((d) => d.cumulative_value).filter((v) => v !== null)
      : []),
  ];

  if (values.length === 0) return [0, 1];

  let min, max, step;
  if (interval === "hourly") {
    min = Math.min(...values) - 0.001;
    max = Math.max(...values) + 0.001;
    step = 0.005;
  } else if (interval === "daily") {
    min = Math.min(...values) - 0.01;
    max = Math.max(...values) + 0.01;
    step = 0.05;
  } else if (interval === "monthly") {
    min = Math.min(...values) - 0.1;
    max = Math.max(...values) + 0.1;
    step = 0.1;
  }

  const domain = [Math.floor(min / step) * step, Math.ceil(max / step) * step];
  return domain;
};
