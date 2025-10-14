import type { LoginRequest, TokenResponse, APIResponse, UserType, RegisterDocGiaRequest, RegisterNhanVienRequest } from '../types/auth';
import {apiClient} from "./base-url.ts";

// Add request interceptor to include token in requests
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

export const authService = {
  async login(credentials: LoginRequest, userType: UserType): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<APIResponse<TokenResponse>>(
        `/auth/login/${userType}`,
        credentials
      );

      if (response.data.data) {
        // Save token to localStorage
        localStorage.setItem('authToken', response.data.data.Token);
        localStorage.setItem('userId', response.data.data.UserId);
        localStorage.setItem('userName', response.data.data.UserName);
        localStorage.setItem('userEmail', response.data.data.Email);
        localStorage.setItem('role', response.data.data.Role);
        localStorage.setItem('userType', userType);

        return response.data.data;
      }

      throw new Error(response.data.message || 'Đăng nhập thất bại');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  },

  async registerDocGia(data: RegisterDocGiaRequest): Promise<any> {
    try {
      const response = await apiClient.post<APIResponse<any>>(
        '/docgia/add-dg',
        data
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  },

  async registerNhanVien(data: RegisterNhanVienRequest): Promise<any> {
    try {
      const response = await apiClient.post<APIResponse<any>>(
        '/nhanvien/add-nv',
        data
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng ký nhân viên thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  getUserInfo() {
    return {
      userName: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      userType: localStorage.getItem('userType'),
    };
  }
};
