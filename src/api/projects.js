import apiClient, { toast } from "@/config/axios";

export const projectsAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/projects", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/projects/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post("/auth/projects", data);
      toast.success("Tạo project thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/auth/projects/${id}`, data);
      toast.success("Cập nhật project thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/projects/${id}`);
      toast.success("Xóa project thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
