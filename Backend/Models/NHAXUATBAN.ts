import mongoose, { Schema, Document } from "mongoose";

export interface INhaxuatban extends Document {
    _id: {type: mongoose.Schema.Types.ObjectId},
    MaNXB: string,
    TenNXB: string,
    DiaChi: string
}

const NHAXUATBAN = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaNXB: {type: String, unique: true}, // Bỏ required để hook có thể tạo trước khi validate
    TenNXB: {type: String, required: true, unique: true},
    DiaChi: {type: String, required: true}
}, {
    timestamps: true
});

// Pre-save hook để tự động tạo MaNXB
NHAXUATBAN.pre('save', async function(next) {
    if (!this.isNew || this.MaNXB) {
        return next();
    }
    
    try {
        const count = await mongoose.models.NHAXUATBAN.countDocuments({});
        this.MaNXB = `NXB${(count + 1).toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error as Error);
    }
});

const NhaXuatBan = mongoose.model<INhaxuatban>("NHAXUATBAN", NHAXUATBAN);
export default NhaXuatBan;