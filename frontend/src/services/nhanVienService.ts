import axios from 'axios';

const API_BASE_URL = '/api';

export interface NhanVien {
  _id: string;
  MSNV: string;
  TenTaiKhoan: string;
  HoTenNV: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
  NgaySinh?: string;
  Phai?: string;
  ChucVu?: string;
}

export interface CreateNhanVienRequest {
  HoTenNV: string;
  TenTaiKhoan: string;
  MatKhau: string;
  NgaySinh: string;
  Phai: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
  ChucVu?: string;
}

export interface UpdateNhanVienRequest {
  HoTenNV?: string;
  DiaChi?: string;
  SoDienThoai?: string;
  Email?: string;
  NgaySinh?: string;
  Phai?: string;
}

class NhanVienService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/nhanvien`,
  });

  constructor() {
    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Get all staff members
  async getAllNhanVien(): Promise<NhanVien[]> {
    const response = await this.api.get('/');
    return response.data.data;
  }

  // Get staff member by ID
  async getNhanVienById(id: string): Promise<NhanVien> {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  // Create new staff member (Admin only)
  async createNhanVien(data: CreateNhanVienRequest): Promise<NhanVien> {
    const response = await this.api.post('/', data);
    return response.data.data;
  }

  // Update staff member
  async updateNhanVien(id: string, data: UpdateNhanVienRequest): Promise<void> {
    await this.api.put(`/${id}`, data);
  }

  // Delete staff member
  async deleteNhanVien(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }
}

export const nhanVienService = new NhanVienService();

