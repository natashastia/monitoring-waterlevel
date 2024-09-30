import dayjs from "dayjs";

const CustomTooltip = ({ payload, label, interval }) => {
  if (payload && payload.length) {
    let formattedLabel;
    if (interval === "hourly") {
      formattedLabel = dayjs(label).format("HH:mm");
    } else if (interval === "daily") {
      formattedLabel = dayjs(label).format("DD");
    } else if (interval === "monthly") {
      formattedLabel = dayjs(label).format("MMMM");
    }

    return (
      <div className="bg-white border p-2 rounded shadow-md">
        <p className="font-bold">{formattedLabel}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.stroke }}>
            {entry.name}: -{entry.value} meters
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
