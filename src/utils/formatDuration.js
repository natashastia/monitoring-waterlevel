export const formatDuration = (startString, endString) => {
  const startDate = new Date(startString);
  const endDate = new Date(endString);
  const diffTime = Math.abs(endDate - startDate);

  if (diffTime === 0) {
    return "1s";
  }

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  let duration = "";
  if (diffDays > 0) duration += `${diffDays}d `;
  if (diffHours > 0) duration += `${diffHours}h `;
  if (diffMinutes > 0) duration += `${diffMinutes}m `;
  if (diffSeconds > 0) duration += `${diffSeconds}s`;

  return duration.trim();
};
