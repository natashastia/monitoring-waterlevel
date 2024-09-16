export const validateThresholds = ({ alert, critical }) => {
  if (!alert || !critical) {
    return "Both alert and critical values are required ⚠️";
  }

  if (isNaN(parseFloat(alert)) || isNaN(parseFloat(critical))) {
    return "Both alert and critical values must be numbers ⚠️";
  }

  const alertValue = parseFloat(alert);
  const criticalValue = parseFloat(critical);

  if (alertValue >= criticalValue) {
    return "The critical value must be greater than alert ⚠️";
  }

  if (criticalValue > 20) {
    return "The critical value is too large ⚠️";
  }

  return "";
};
