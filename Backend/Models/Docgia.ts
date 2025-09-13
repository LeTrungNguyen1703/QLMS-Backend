import mongoose, { Schema, Document } from "mongoose";

export interface IDocgia extends Document {
    holot: string,
    ten: string,
    ngaysinh: Date,
    phai: "nam" | "nữ" | "khác",
    diachi: string,
    sodienthoai: string
}

const docgia: Schema = new Schema({
    holot: {type: String, required: true},
    ten: {type: String, required: true},
    ngaysinh: {type: Date, required: true},
    phai: {type: String, required: true, enum: ["nam", "nữ", "khác"], default: "nam"},
    diachi: {type: String, required: true},
    sodienthoai: {type: String, required: true, unique: true}
});

const DocGia = mongoose.model<IDocgia>("docgia", docgia);
export default DocGia;
