import { getCategory } from "./getCategory";

export const calculateAllPercentageChanges = (data) => {
  const changes = [];

  for (let i = 0; i < data.length - 1; i++) {
    const currentData = data[i];
    const previousData = data[i + 1];

    const currentValue = currentData.cumulative_value;
    const previousValue = previousData.cumulative_value;

    if (currentValue !== null && previousValue !== null) {
      const change = ((currentValue - previousValue) / previousValue) * 100;
      const sign = change > 0 ? "-" : "";
      const category = sign === "+" ? "Aman" : getCategory(change);
      const color =
        sign === "+"
          ? "green"
          : category === "Rusak"
          ? "red"
          : category === "Kritis"
          ? "orange"
          : category === "Rawan"
          ? "yellow"
          : "green";

      changes.push({
        change: Math.abs(change),
        sign,
        category,
        color,
        currentTime: currentData.starts_at,
        previousTime: previousData.starts_at,
      });
    }
  }

  return changes;
};
