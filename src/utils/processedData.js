export const processedData = (filteredData) => {
  return filteredData.map((item, index, array) => {
    const previousItem = array[index + 1];
    return {
      ...item,
      previousValue: previousItem
        ? previousItem.cumulative_value
        : item.cumulative_value,
      index: index + 1,
    };
  });
};
