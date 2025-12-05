// Authentication types based on backend interfaces

export interface LoginRequest {
    TenTaiKhoan: string;
    MatKhau: string;
}

export interface RegisterDocGiaRequest {
    HoLot: string;
    Ten: string;
    TenTaiKhoan: string;
    MatKhau: string;
    NgaySinh: string; // ISO date string
    Phai: "nam" | "nữ" | "khác";
    DiaChi: string;
    SoDienThoai: string;
    Email: string;
}

export interface RegisterNhanVienRequest {
    HoTenNV: string;
    TenTaiKhoan: string;
    MatKhau: string;
    NgaySinh: string; // ISO date string
    Phai: "nam" | "nữ" | "khác";
    DiaChi: string;
    SoDienThoai: string;
    Email: string;
    ChucVu: string;
}

export interface TokenResponse {
    Token: string;
    UserId: string;
    UserName: string;
    Email: string;
    Role: string;
}

export interface APIResponse<T> {
    message: string;
    data?: T;
}

export enum UserType {
    DOCGIA = 'docgia',
    NHANVIEN = 'nhanvien',
    ADMIN = 'admin'
}
