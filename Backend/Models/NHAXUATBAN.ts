import mongoose, { Schema, Document } from "mongoose";

export interface INhaxuatban extends Document {
    TenNXB: string,
    DiaChi: string
}

const NHAXUATBAN = new mongoose.Schema({
    TenNXB: {type: String, required: true, unique: true},
    DiaChi: {type: String, required: true}
});

const NhaXuatBan = mongoose.model<INhaxuatban>("NHAXUATBAN", NHAXUATBAN);
export default NhaXuatBan;