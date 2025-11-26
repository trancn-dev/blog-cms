import apiClient, { toast } from "@/config/axios";

export const mediaAPI = {
  async getAll(params) {
    try {
      return await apiClient.get("/auth/media", { params });
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async upload(formData) {
    try {
      const response = await apiClient.post("/auth/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Upload file thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/auth/media/${id}`);
      toast.success("Xóa file thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },
};
