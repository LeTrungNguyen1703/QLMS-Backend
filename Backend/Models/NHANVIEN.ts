import mongoose, { Schema, Document } from "mongoose";

export interface INhanvien extends Document {
    HoTenNV?: string,
    MatKhau: string,
    DiaChi?: string,
    SoDienThoai: string,
    ChucVu: "nhân viên" | "admin",
    NgayTao: Date
}

const NHANVIEN: Schema = new Schema({
    MSNV: {type: String, required: true, unique: true},
    HoTenNV: {type: String, required: false, default: ""},
    MatKhau: {type: String, required: true},
    DiaChi: {type: String, required: false, default: ""},
    SoDienThoai: {type: String, required: true, unique: true},
    ChucVu: {type: String, required: false, enum:["nhân viên", "admin"], default: "nhân viên"},
    NgayTao: {type: Date, default: Date.now}
}, {
    timestamps: true
});

const NhanVien = mongoose.model<INhanvien>("NHANVIEN", NHANVIEN);
export default NhanVien;
