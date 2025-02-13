import api from "../configs/api";

const SERVICE_URL = "/api/orders";
const getOrders = () => {
  return api.get(`${SERVICE_URL}`);
};

const placeOrder = (payload) => {
  return api.post(`${SERVICE_URL}`, payload);
};
export { getOrders, placeOrder };
