 
import axios from "axios";
export default {
  adminLogin: async (postBody) => {
    // const API_URL = import.meta.env.VITE_APP_URL;
    const API_URL = import.meta.env.VITE_APP_MODE === "development" ? import.meta.env.VITE_APP_URL : import.meta.env.VITE_APP_URL_PRODUCTION;

      try {
        const response = await axios.post(`${API_URL}/auth/login`, postBody);
        console.log("Login response:", response);
        if(response.status !== 200){
          return {
            status: false,
            statusCode: response.status,
            message: response?.data?.message || "Login failed",
          };
        }
        return {
          status: true,
          statusCode: 200,
          data: response.data,
          message: response?.data?.message,
        };
      } catch (error) {

        
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Login failed";

        if (error.response) {
          console.log("Error response:", error.response);
        }
        if (error.request) {
          console.log("Error request:", error.request);
        }
        return { status: false, statusCode: error.status, message: msg };
      }
  
  },
};
