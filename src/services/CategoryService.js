import api from "../configs/api";

const SERVICE_URL = "/api/categories";
const getCategories = (pageRequest = { page: 0, size: 10, sort: [] }) => {
  return api.get(SERVICE_URL, {
    params: {
      page: pageRequest.page,
      size: pageRequest.size,
      sort: pageRequest.sort.length ? pageRequest.sort.join(",") : undefined,
    },
  });
};
export { getCategories };
