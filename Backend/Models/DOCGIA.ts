import mongoose, { Schema, Document } from "mongoose";

export interface IDocgia extends Document {
    _id: {type: mongoose.Schema.Types.ObjectId},
    MaDocGia: string,
    HoLot: string,
    Ten: string,
    NgaySinh: Date,
    Phai: "nam" | "nữ" | "khác",
    DiaChi: string,
    SoDienThoai: string,
    ChucVu?:string
}

const DOCGIA: Schema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaDocGia: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    HoLot: {type: String},
    Ten: {type: String},
    NgaySinh: {type: Date},
    Phai: {type: String, enum: ["nam", "nữ", "khác"], default: "nam"},
    DiaChi: {type: String},
    SoDienThoai: {type: String, unique: true, required: true}, // Đặt unique và required
    ChucVu: {type: String, enum: "DOC_GIA", default: "DOC_GIA"},
}, {
    timestamps: true
});

// Pre-save hook để tự động tạo MaDocGia
DOCGIA.pre('save', async function(next) {
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

const DocGia = mongoose.model<IDocgia>("DOCGIA", DOCGIA);
export default DocGia;
