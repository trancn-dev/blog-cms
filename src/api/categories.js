import apiClient, { toast } from "@/config/axios";

export const categoriesAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/categories", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/categories/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post("/auth/categories", data);
      toast.success("Tạo danh mục thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/auth/categories/${id}`, data);
      toast.success("Cập nhật danh mục thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/categories/${id}`);
      toast.success("Xóa danh mục thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
