import dayjs from "dayjs";

export const formatXAxisTick = (tickItem, interval) => {
  if (interval === "hourly") {
    return new Date(tickItem).getHours().toString().padStart(2, "0");
  } else if (interval === "daily") {
    return dayjs(tickItem).format("D");
  } else if (interval === "monthly") {
    return dayjs(tickItem).format("MMM");
  }
};
