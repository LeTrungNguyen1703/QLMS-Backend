import axios from 'axios';
import type { LoginRequest, TokenResponse, APIResponse, UserType } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        localStorage.setItem('userName', response.data.data.UserName);
        localStorage.setItem('userEmail', response.data.data.Email);
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

