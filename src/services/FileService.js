import api from "../api/api";

export default {
  fileUpload: async (files, setUploadPercentage) => {

    const API_URL = import.meta.env.VITE_APP_MODE === "development" ? import.meta.env.VITE_APP_URL : import.meta.env.VITE_APP_URL_PRODUCTION;
    // const API_URL = import.meta.env.VITE_APP_URL;
    const form = new FormData();

   
    if (files instanceof File) {
      form.append("image", files);
    } else if (Array.isArray(files)) {
      for (let i = 0; i < files.length; i++) {
        form.append("files[]", files[i]);
      }
    } else if (files?.length) {
      // In case it's a FileList (from input.files)
      for (let i = 0; i < files.length; i++) {
        form.append("files[]", files[i]);
      }
    } else {
      console.error("No valid file(s) provided");
      return { status: false, message: "No valid file(s) provided" };
    }

    try {
      const response = await api.post(`${API_URL}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!e.total) return;
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadPercentage?.(pct);
        },
      });

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
        "Upload Failed";

      console.error("Upload Error:", error);

      return { status: false, statusCode: error.status, message: msg };
    }
  },
};
