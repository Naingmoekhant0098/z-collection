import axios from "axios";
import customToast from "../components/customToast";
// import customToast from "@/component/customToast";
import Cookies from "js-cookie";
const apiHost = import.meta.env.VITE_APP_MODE === "development" ? import.meta.env.VITE_APP_URL : import.meta.env.VITE_APP_URL_PRODUCTION;

const api = axios.create({
  baseURL: apiHost,
  // timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        customToast.error(
          "Unauthorized",
          "You don’t have access to this resource"
        );
        Cookies.remove("token");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);
export default api;
