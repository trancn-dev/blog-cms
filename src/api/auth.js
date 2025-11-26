import apiClient, { toast } from "@/config/axios";

export const authAPI = {
  async login(credentials) {
    try {
      const response = await apiClient.post("/login", credentials);
      toast.success("Đăng nhập thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async logout() {
    try {
      const response = await apiClient.post("/auth/logout");
      toast.success("Đăng xuất thành công!");
      return response;
    } catch ({ message }) {
      toast.error(message);
      throw message;
    }
  },

  async me() {
    try {
      return await apiClient.get("/auth/me");
    } catch ({ message }) {
      throw message;
    }
  },

  async refresh() {
    try {
      return await apiClient.post("/auth/refresh");
    } catch ({ message }) {
      throw message;
    }
  },
};
