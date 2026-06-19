import api from "../api/api";
import { useBaseService } from "./BaseService";

export const UserService = () => {
  let base = useBaseService("user");
  const fetchAllCustomers = async (params) => {
    return await api.get(`/customer`, { params });
  };

  return {
    fetchAllCustomers,
    ...base,
  };
};
