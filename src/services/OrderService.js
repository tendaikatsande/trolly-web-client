import api from "../configs/api";

const SERVICE_URL = "/api/orders";
const getOrders = ({ page = 0, size = 10 }) => {
  return api.get(
    `${SERVICE_URL}?page=${page}&size=${size}&sort=createdAt,desc`
  );
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

const createPayment = (id, payload) => {
  return api.put(`${SERVICE_URL}/${id}/payment`, payload);
};

const updatePayment = (id, payload) => {
  return api.put(`${SERVICE_URL}/${id}/payment/update`, payload);
};

export {
  getOrders,
  placeOrder,
  cancelOrder,
  getOrder,
  createPayment,
  updatePayment,
};
