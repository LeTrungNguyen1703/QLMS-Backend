// Authentication types based on backend interfaces

export interface LoginRequest {
  TenTaiKhoan: string;
  MatKhau: string;
}

export interface TokenResponse {
  Token: string;
  UserName: string;
  Email: string;
}

export interface APIResponse<T> {
  message: string;
  data?: T;
}

export enum UserType {
  DOCGIA = 'docgia',
  NHANVIEN = 'nhanvien'
}

