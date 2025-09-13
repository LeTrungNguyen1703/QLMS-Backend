import mongoose, { Schema, Document } from "mongoose";

export interface INhanvien extends Document {
    hotennv?: string,
    matkhau: string,
    diachi?: string,
    sodienthoai: string,
    chucvu: "nhân viên" | "admin",
    ngaytao: Date
}

const NHANVIEN: Schema = new Schema({
    hotennv: {type: String, required: false, default: ""},
    matkhau: {type: String, required: true},
    diachi: {type: String, required: false, default: ""},
    sodienthoai: {type: String, required: true, unique: true},
    chucvu: {type: String, required: false, enum:["nhân viên", "admin"], default: "nhân viên"},
    ngaytao: {type: Date, default: Date.now}
});

const NhanVien = mongoose.model<INhanvien>("NHANVIEN", NHANVIEN);
export default NhanVien;  
