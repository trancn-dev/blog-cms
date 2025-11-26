import apiClient, { toast } from "@/config/axios";

export const aboutAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/about-sections", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/about-sections/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post("/auth/about-sections", data);
      toast.success("Tạo section thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/auth/about-sections/${id}`, data);
      toast.success("Cập nhật section thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/about-sections/${id}`);
      toast.success("Xóa section thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
