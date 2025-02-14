import api from "../configs/api";

const SERVICE_URL = "/api/products";
const getProducts = (
  search,
  categoryId,
  pageRequest = { page: 0, size: 10, sort: [] }
) => {
  return api.get(SERVICE_URL, {
    params: {
      search: search ?? null,
      categoryId: categoryId ?? null,
      page: pageRequest.page,
      size: pageRequest.size,
      sort: pageRequest.sort.length ? pageRequest.sort.join(",") : undefined,
    },
  });
};

const getProduct = (id) => {
  return api.get(`${SERVICE_URL}/${id}`);
};

const addProduct = (formData) => {
  return api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateProduct = (id, formData) => {
  return api.put(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteProduct = (id) => {
  return api.delete(`/api/products/${id}`);
};
export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
