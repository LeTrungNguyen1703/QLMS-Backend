import mongoose, { Schema, Document } from "mongoose";

export interface IDocgia extends Document {
    MaDocGia: string,
    HoLot: string,
    Ten: string,
    NgaySinh: Date,
    Phai: "nam" | "nữ" | "khác",
    DiaChi: string,
    SoDienThoai: string
}

const DOCGIA: Schema = new Schema({
    MaDocGia: {type: String, required: true, unique: true},
    HoLot: {type: String, required: true},
    Ten: {type: String, required: true},
    NgaySinh: {type: Date, required: true},
    Phai: {type: String, required: true, enum: ["nam", "nữ", "khác"], default: "nam"},
    DiaChi: {type: String, required: true},
    SoDienThoai: {type: String, required: true, unique: true}
}, {
    timestamps: true
});

const DocGia = mongoose.model<IDocgia>("DOCGIA", DOCGIA);
export default DocGia;
