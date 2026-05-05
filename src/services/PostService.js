import axios from "axios";
import { useBaseService } from "./BaseService";
import Cookie from "js-cookie";

export const ProductService = () => {
  let base = useBaseService("products");
  const apiHost = import.meta.env.VITE_APP_MODE === "development" ? import.meta.env.VITE_APP_URL : import.meta.env.VITE_APP_URL_PRODUCTION;

  return {
    ...base,
    generateExcelProduct: async (params) => {
      const token = Cookie.get("token");
      try {
        const response = await axios.get(`${apiHost}/products/export/generateExcel`, {
          params: params,
          responseType: "blob", // CRITICAL: Tells axios to handle binary data
          headers: {
            Authorization: `Bearer ${token}`, // If protected
          },
        });
        return response.data;
      } catch (err) {
        throw err;
      }
    },
  };
};
