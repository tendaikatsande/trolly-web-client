import api from "../configs/api";

const addAddress = (payload) => {
  return api.post("/api/auth/addresses", payload);
};

const updateAddress = async (updatedAddress) => {
  return api.put(`/api/auth/addresses/${updatedAddress.id}`, updatedAddress);
};

const deleteAddress = async (id) => {
  return api.delete(`/api/auth/addresses/${id}`);
};

export { addAddress, updateAddress, deleteAddress };
