export const validateThresholds = ({ alert, critical }) => {
  if (alert === "" || critical === "") {
    return "";
  }

  if (parseFloat(alert) >= parseFloat(critical)) {
    return "The critical value must be greater ⚠️";
  }

  if (parseFloat(critical) > 20) {
    return "The critical value is too large ⚠️";
  }

  return "";
};
