import api from "../configs/api";

const SERVICE_URL = "/api/orders";
const getOrders = () => {
  return api.get(`${SERVICE_URL}?sort=createdAt,desc`);
};

const placeOrder = (payload) => {
  return api.post(`${SERVICE_URL}`, payload);
};

const getOrder = (id) => {
  return api.get(`${SERVICE_URL}/${id}`);
};

const cancelOrder = (id) => {
  return api.put(`${SERVICE_URL}/${id}/cancel`);
};
export { getOrders, placeOrder, cancelOrder, getOrder };
