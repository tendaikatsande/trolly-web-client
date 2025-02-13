import api from "../configs/api";

const SERVICE_URL = "/api/payments";

const initiatePayment = (payload) => {
  return api.post(`${SERVICE_URL}`, payload);
};
export { initiatePayment };
