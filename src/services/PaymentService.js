import api from "../configs/api";

const SERVICE_URL = "/api/payments";

const initiateWebPayment = (payload) => {
  return api.post(`${SERVICE_URL}/web`, payload);
};
const initiateMobilePayment = (payload) => {
  return api.post(`${SERVICE_URL}/mobile`, payload);
};

const checkPayment = (payload) => {
  return api.post(`${SERVICE_URL}/check`, payload);
};

const pollPayment = (payload) => {
  return api.post(`${SERVICE_URL}/poll`, payload);
};
export { initiateWebPayment, initiateMobilePayment, checkPayment, pollPayment };
