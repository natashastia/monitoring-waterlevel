export const getCategory = (change) => {
  if (change > 60) return "Rusak";
  if (change > 40) return "Kritis";
  if (change > 20) return "Rawan";
  return "Aman";
};
