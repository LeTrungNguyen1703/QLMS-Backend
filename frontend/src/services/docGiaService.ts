import { apiClient } from "./base-url";

export interface DocGia {
  _id: string;
  MaDocGia: string;
  HoLot: string;
  Ten: string;
  Email?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  NgaySinh?: string;
}

export const docGiaService = {
  // Search for a customer by MaDocGia or name
  async searchDocGia(query: string): Promise<DocGia | null> {
    try {
      const response = await apiClient.get("/docgia/search", {
        params: { query }
      });
      return response.data.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get all books loaned by a customer
  async getLoanedBooks(docGiaId: string) {
    const response = await apiClient.get(`/muonsach/get-by-docgia/${docGiaId}`);
    return response.data.data || [];
  },
};

