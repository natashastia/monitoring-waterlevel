import axios from "axios";
import { filterDataByInterval } from "./dataFilters";
import { filterDataByPrevious } from "./dataFiltersPrevious";

export const fetchDeviceData = async (baseUrl, device_id, interval, token) => {
  const url = new URL(`${baseUrl}/api/devices/${device_id}/energies`);
  const params = new URLSearchParams({
    interval: interval,
    sort_by: "created_at",
    order_by: "desc",
  });
  url.search = params.toString();

  const response = await axios.get(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const filteredData = filterDataByInterval(response.data.data, interval);
  const filteredDataPrevious = filterDataByPrevious(
    response.data.data,
    interval
  );

  return { filteredData, filteredDataPrevious };
};
