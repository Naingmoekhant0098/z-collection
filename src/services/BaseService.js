import api from "../api/api";

export const useBaseService = (type) => {
  const handleRequest = async (request, errorMsg) => {
    try {
      const res = await request;
      return {
        status: true,
        statusCode: 200,
        data: res.data,
        message: res.data?.message || "Success",
      };
    } catch (err) {
      console.error(err.response || err.request || err.message);
      return {
        status: false,
        statusCode: err.response?.status || 500,
        message: err?.response?.data?.message || err.message || errorMsg,
      };
    }
  };

  return {
    fetchAll: (params) =>
      handleRequest(api.get(`/${type}`, { params }), "Fetch failed"),

    getById: (id) => handleRequest(api.get(`/${type}/${id}`), "Get failed"),

    create: (data) =>
      handleRequest(
        api.post(`/${type}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        "Create failed"
      ),

    createTwo: (data) =>
      handleRequest(api.post(`/${type}`, data, {}), "Create failed"),
    updateById: (id, data) =>
      handleRequest(api.patch(`/${type}/${id}`, data), "Update failed"),

    updateByIdPut: (id, data) =>
      handleRequest(api.put(`/${type}/${id}`, data), "Update failed"),

    deleteById: (id) =>
      handleRequest(api.delete(`/${type}/${id}`), "Delete failed"),

    updateStatus: (id, status) =>
      handleRequest(
        api.put(`/${type}/${id}`, { status }),
        "Status update failed"
      ),
  };
};
