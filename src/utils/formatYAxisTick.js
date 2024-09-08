export function formatYAxisTick(value, interval) {
  let formattedValue;

  if (interval === "hourly") {
    formattedValue = value.toFixed(3);
  } else if (interval === "daily") {
    formattedValue = value.toFixed(2);
  } else if (interval === "monthly") {
    formattedValue = value.toFixed(1);
  }

  return `-${formattedValue}`;
}
