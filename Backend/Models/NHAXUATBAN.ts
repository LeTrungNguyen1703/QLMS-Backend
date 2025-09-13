import mongoose, { Schema, Document } from "mongoose";

export interface INhaxuatban extends Document {
    TenNXB: string,
    DiaChi: string
}

const NHAXUATBAN = new mongoose.Schema({
    MaNXB: {type: String, required: true, unique: true},
    TenNXB: {type: String, required: true, unique: true},
    DiaChi: {type: String, required: true}
}, {
    timestamps: true
});

const NhaXuatBan = mongoose.model<INhaxuatban>("NHAXUATBAN", NHAXUATBAN);
export default NhaXuatBan;