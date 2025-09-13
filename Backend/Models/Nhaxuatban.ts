import mongoose, { Schema, Document } from "mongoose";

export interface INhaxuatban extends Document {
    tennxb: string,
    diachi: string
}

const nhaxuatban = new mongoose.Schema({
    tennxb: {type: String, required: true, unique: true},
    diachi: {type: String, required: true}
});

const NhaXuatBan = mongoose.model<INhaxuatban>("nhaxuatban", nhaxuatban);
export default NhaXuatBan;