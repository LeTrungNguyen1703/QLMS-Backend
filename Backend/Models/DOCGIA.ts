import mongoose, {Schema, Document} from "mongoose";
import {UserRole} from "../Enums/UserRole";

export interface IDocgia extends Document {
    _id: { type: mongoose.Schema.Types.ObjectId },
    MaDocGia: string,
    HoLot: string,
    Ten: string,
    TenTaiKhoan: string,
    MatKhau: string,
    NgaySinh: Date,
    Phai: "nam" | "nữ" | "khác",
    DiaChi: string,
    SoDienThoai: string,
    ChucVu: UserRole.DOC_GIA,
    Email: string
}

const DOCGIA: Schema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaDocGia: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    HoLot: {type: String},
    Ten: {type: String},
    TenTaiKhoan: {type: String, unique: true},
    MatKhau: {type: String, unique: true},
    NgaySinh: {type: Date},
    Phai: {type: String, enum: ["nam", "nữ", "khác"], default: "nam"},
    DiaChi: {type: String},
    SoDienThoai: {type: String, unique: true, required: true}, // Đặt unique và required
    ChucVu: {type: String, enum: UserRole.DOC_GIA, default: UserRole.DOC_GIA},
    Email: {type: String, unique: true, required: true} // Đặt unique và required
}, {
    timestamps: true
});

// Pre-save hook để tự động tạo MaDocGia
DOCGIA.pre('save', async function (next) {
    if (!this.isNew || this.MaDocGia) {
        return next();
    }

    try {
        const count = await mongoose.models.DOCGIA.countDocuments({});
        this.MaDocGia = `DG${(count + 1).toString().padStart(4, '0')}`;
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Pre-save hook để mã hóa mật khẩu
DOCGIA.pre('save', async function (next) {
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

const DocGia = mongoose.model<IDocgia>("DOCGIA", DOCGIA);
export default DocGia;
