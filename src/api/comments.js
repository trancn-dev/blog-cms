import apiClient, { toast } from "@/config/axios";

export const commentsAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/comments", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async getById(id) {
    try {
      return await apiClient.get(`/auth/comments/${id}`);
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async approve(id) {
    try {
      const response = await apiClient.put(`/auth/comments/${id}/approve`);
      toast.success("Duyệt bình luận thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async reject(id) {
    try {
      const response = await apiClient.put(`/auth/comments/${id}/reject`);
      toast.success("Từ chối bình luận thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/comments/${id}`);
      toast.success("Xóa bình luận thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
