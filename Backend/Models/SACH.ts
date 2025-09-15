import mongoose, {Schema, Document} from "mongoose";
import { INhaxuatban } from "./NHAXUATBAN";

export interface ISach extends Document {
    _id: {type: mongoose.Schema.Types.ObjectId},
    MaSach: string,
    HinhAnh: string,
    TenSach: string,
    DonGia: number,
    SoQuyen: number,
    NamXuatBan: Date,
    IdNxb: mongoose.Types.ObjectId | INhaxuatban,
    TacGia: string
}

const SACH = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaSach: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    HinhAnh: {type: String, required: false},
    TenSach: {type: String, required: true},
    DonGia: {type: Number, required: true},
    SoQuyen: {type: Number, required: true},
    NamXuatBan: {type: Date, required: true},
    IdNxb: {type: mongoose.Schema.Types.ObjectId, ref: 'NHAXUATBAN', required: true},
    TacGia: {type: String, required: true}
}, {
    timestamps: true
});

// Pre-save hook để tự động tạo MaSach
SACH.pre('save', async function(next) {
    if (!this.isNew || this.MaSach) {
        return next();
    }

    try {
        const count = await mongoose.models.SACH.countDocuments({});
        this.MaSach = `S${(count + 1).toString().padStart(4, '0')}`;
        next();
    } catch (error) {
        next(error as Error);
    }
});

const Sach = mongoose.model<ISach>("SACH", SACH);
export default Sach;