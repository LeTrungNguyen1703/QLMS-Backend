export interface INhanVienResponse {
    _id?: string;
    MSNV?: string;
    HoTenNV?: string;
    DiaChi?: string;
    SoDienThoai?: string;
    ChucVu?: "nhân viên" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}

