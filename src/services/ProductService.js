import api from "../configs/api";

const SERVICE_URL = "/api/products";
const getProducts = () => {
  return api.get(`${SERVICE_URL}`);
};
export { getProducts };
