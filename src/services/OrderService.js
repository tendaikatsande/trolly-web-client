import api from "../configs/api";

const SERVICE_URL = "/api/orders";
const getOrders = () => {
  return api.get(`${SERVICE_URL}`);
};
export { getOrders };
