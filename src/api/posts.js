import apiClient, { toast } from "@/config/axios";

export const postsAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/posts", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/posts/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post("/auth/posts", data);
      toast.success("Tạo bài viết thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/auth/posts/${id}`, data);
      toast.success("Cập nhật bài viết thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/posts/${id}`);
      toast.success("Xóa bài viết thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
