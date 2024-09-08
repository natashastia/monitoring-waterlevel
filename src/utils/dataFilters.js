import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const filterDataByInterval = (data, interval) => {
  const today = dayjs().startOf("day");
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");
  const startOfYear = dayjs().startOf("year");
  const endOfYear = dayjs().endOf("year");

  switch (interval) {
    case "daily":
      return data.filter(({ starts_at }) =>
        dayjs(starts_at).isBetween(startOfMonth, endOfMonth, null, "[]")
      );
    case "hourly":
      return data.filter(({ starts_at }) =>
        dayjs(starts_at).isBetween(today, today.endOf("day"), null, "[]")
      );
    case "monthly":
      return data.filter(({ starts_at }) =>
        dayjs(starts_at).isBetween(startOfYear, endOfYear, null, "[]")
      );
    default:
      return data;
  }
};
