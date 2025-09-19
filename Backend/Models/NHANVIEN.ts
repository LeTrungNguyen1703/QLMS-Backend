import mongoose, { Schema, Document } from "mongoose";
import {UserRole} from "../Enums/UserRole";

export interface INhanvien extends Document {
    _id: {type: mongoose.Schema.Types.ObjectId},
    MSNV: string,
    TenTaiKhoan: string,
    HoTenNV: string,
    MatKhau: string,
    DiaChi: string,
    SoDienThoai: string,
    ChucVu: UserRole.NHAN_VIEN | UserRole.ADMIN,
    Email: string
}

const NHANVIEN: Schema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MSNV: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    TenTaiKhoan: {type: String, unique: true, required: true},
    HoTenNV: {type: String, required: false, default: ""},
    MatKhau: {type: String, required: true},
    DiaChi: {type: String, required: false, default: ""},
    SoDienThoai: {type: String, required: true, unique: true},
    ChucVu: {type: String, enum: [UserRole.NHAN_VIEN, UserRole.ADMIN], default: UserRole.NHAN_VIEN},
    Email: {type: String, unique: true, required: true} // Đặt unique và required
    
}, {
    timestamps: true
});

// Pre-save hook để tự động tạo MSNV
NHANVIEN.pre('save', async function(next) {
    if (!this.isNew || this.MSNV) {
        return next();
    }
    
    try {
        const count = await mongoose.models.NHANVIEN.countDocuments({});
        this.MSNV = `NV${(count + 1).toString().padStart(4, '0')}`;
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Pre-save hook để mã hóa mật khẩu
NHANVIEN.pre('save', async function(next) {
    // Chỉ hash mật khẩu khi nó được thay đổi (hoặc là document mới)
    if (!this.isModified('MatKhau')) {
        return next();
    }

    try {
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        this.MatKhau = await bcrypt.hash(this.MatKhau, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

const NhanVien = mongoose.model<INhanvien>("NHANVIEN", NHANVIEN);
export default NhanVien;
