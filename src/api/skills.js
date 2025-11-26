import apiClient, { toast } from "@/config/axios";

export const skillsAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/skills", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/skills/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post("/auth/skills", data);
      toast.success("Tạo skill thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/auth/skills/${id}`, data);
      toast.success("Cập nhật skill thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/skills/${id}`);
      toast.success("Xóa skill thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
