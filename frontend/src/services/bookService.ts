import axios from 'axios';
import type { Sach, TheoDoiMuonSach, MuonSachRequest } from '../types/book';
import type { APIResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const bookService = {
  // Tìm kiếm sách (cho Đọc giả)
  async searchBooks(): Promise<Sach[]> {
    try {
      const response = await apiClient.get<APIResponse<Sach[]>>('/sach/search-sach');
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Không thể tải danh sách sách');
    }
  },

  // Lấy chi tiết sách
  async getBookById(id: string): Promise<Sach> {
    try {
      const response = await apiClient.get<APIResponse<Sach>>(`/sach/get-sach/${id}`);
      return response.data.data!;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Không thể tải thông tin sách');
    }
  },

  // Mượn sách
  async borrowBook(data: MuonSachRequest): Promise<TheoDoiMuonSach> {
    try {
      const response = await apiClient.post<APIResponse<TheoDoiMuonSach>>(
        '/theodoimuonsach/add-muonsach',
        data
      );
      return response.data.data!;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Không thể mượn sách. Vui lòng thử lại.');
    }
  },

  // Lấy danh sách sách đã mượn của đọc giả
  async getMyBorrowedBooks(docGiaId: string): Promise<TheoDoiMuonSach[]> {
    try {
      const response = await apiClient.get<APIResponse<TheoDoiMuonSach[]>>(
        `/theodoimuonsach/get-by-docgia/${docGiaId}`
      );
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Nếu chưa có sách nào, trả về mảng rỗng
      return [];
    }
  },

  // Lấy lịch sử mượn sách (tất cả trạng thái)
  async getBorrowHistory(docGiaId: string): Promise<TheoDoiMuonSach[]> {
    try {
      const response = await apiClient.get<APIResponse<TheoDoiMuonSach[]>>(
        `/theodoimuonsach/get-by-docgia/${docGiaId}`
      );
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      return [];
    }
  }
};

