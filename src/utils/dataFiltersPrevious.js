import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const filterDataByPrevious = (data, interval) => {
  const today = dayjs().startOf("day");

  const startOfLastMonth = dayjs().subtract(1, "month").startOf("month");
  const endOfLastMonth = dayjs().subtract(1, "month").endOf("month");

  const startOfYesterday = dayjs().subtract(1, "day").startOf("day");
  const endOfYesterday = dayjs().subtract(1, "day").endOf("day");

  switch (interval) {
    case "hourly":
      return data.filter(({ starts_at }) =>
        dayjs(starts_at).isBetween(startOfYesterday, endOfYesterday, null, "[]")
      );
    case "daily":
      return data.filter(({ starts_at }) =>
        dayjs(starts_at).isBetween(startOfLastMonth, endOfLastMonth, null, "[]")
      );
    default:
      return data;
  }
};
