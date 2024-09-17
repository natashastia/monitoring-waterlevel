import { getCategory } from "./getCategory";

export const calculatePercentageChanges = (data) => {
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

export const calculateAllPercentageChanges = (data) => {
  const changes = [];

  const groupedData = {
    hourly: [],
    daily: [],
    monthly: [],
  };

  data.forEach((item) => {
    if (groupedData[item.interval]) {
      groupedData[item.interval].push(item);
    }
  });

  const sortByTimeDesc = (arr) => {
    return arr.sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
  };

  const calculatePercentageForGroup = (group, groupName) => {
    const sortedGroup = sortByTimeDesc(group);

    for (let i = 0; i < sortedGroup.length - 1; i++) {
      const currentData = sortedGroup[i];
      const previousData = sortedGroup[i + 1];

      const currentValue = parseFloat(currentData.cumulative_value);
      const previousValue = parseFloat(previousData.cumulative_value);

      if (
        currentValue !== null &&
        previousValue !== null &&
        previousValue !== 0
      ) {
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
          id: currentData.id,
          change: Math.abs(change),
          sign,
          category,
          color,
          currentTime: currentData.starts_at,
          previousTime: previousData.starts_at,
        });
      }
    }

    if (sortedGroup.length > 0) {
      const lastData = sortedGroup[sortedGroup.length - 1];
      changes.push({
        id: lastData.id,
        change: 0,
        sign: "",
        category: "Aman",
        color: "green",
        currentTime: lastData.starts_at,
        previousTime: null,
      });
    }
  };

  calculatePercentageForGroup(groupedData.hourly, "Hourly");
  calculatePercentageForGroup(groupedData.daily, "Daily");
  calculatePercentageForGroup(groupedData.monthly, "Monthly");

  const sortedChanges = changes.sort(
    (a, b) => new Date(b.currentTime) - new Date(a.currentTime)
  );

  return sortedChanges;
};
