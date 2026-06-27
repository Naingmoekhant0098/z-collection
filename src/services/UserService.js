import api from "../api/api";
import { useBaseService } from "./BaseService";

export const UserService = () => {
  let base = useBaseService("user");
  const fetchAllCustomers = async (params) => {
    return await api.get(`/customer`, { params });
  };

  const deleteCustomer = async (id) => {
    return await api.delete(`/customer/${id}`);
  };

  return {
    fetchAllCustomers,
    deleteCustomer,
    ...base,
  };
};
