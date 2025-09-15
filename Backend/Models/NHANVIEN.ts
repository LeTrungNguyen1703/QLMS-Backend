import mongoose, { Schema, Document } from "mongoose";

export interface INhanvien extends Document {
    MSNV: string,
    HoTenNV?: string,
    MatKhau: string,
    DiaChi?: string,
    SoDienThoai: string,
    ChucVu: "nhân viên" | "admin"
}

const NHANVIEN: Schema = new Schema({
    MSNV: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    HoTenNV: {type: String, required: false, default: ""},
    MatKhau: {type: String, required: true},
    DiaChi: {type: String, required: false, default: ""},
    SoDienThoai: {type: String, required: true, unique: true},
    ChucVu: {type: String, enum: "NHAN_VIEN", default: "NHAN_VIEN"}
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

const NhanVien = mongoose.model<INhanvien>("NHANVIEN", NHANVIEN);
export default NhanVien;
