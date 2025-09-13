import mongoose, {Schema, Document} from "mongoose";
import { INhaxuatban } from "./NHAXUATBAN";

export interface ISach extends Document {
    HinhAnh: string,
    TenSach: string,
    DonGia: number,
    SoQuyen: number,
    NamXuatBan: Date,
    IdNxb: mongoose.Types.ObjectId | INhaxuatban,
    TacGia: string
}

const SACH = new mongoose.Schema({
    MaSach: {type: String, required: true, unique: true},
    HinhAnh: {type: String, required: false},
    TenSach: {type: String, required: true},
    DonGia: {type: Number, required: true},
    SoQuyen: {type: Number, required: true},
    NamXuatBan: {type: Date, required: true},
    IdNxb: {type: mongoose.Schema.Types.ObjectId, ref: 'NHAXUATBAN', required: true},
    TacGia: {type: String, required: true}
});

const Sach = mongoose.model<ISach>("SACH", SACH);
export default Sach;