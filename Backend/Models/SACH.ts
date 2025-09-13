import mongoose, {Schema, Document} from "mongoose";

export interface ISach extends Document {
    HinhAnh: string,
    TenSach: string,
    DonGia: number,
    SoQuyen: number,
    NamXuatBan: Date,
    IdNxb: string,
    TacGia: string
}

const SACH = new mongoose.Schema({
    HinhAnh: {type: String, required: false},
    TenSach: {type: String, required: true},
    DonGia: {type: Number, required: true},
    SoQuyen: {type: Number, required: true},
    NamXuatBan: {type: Date, required: true},
    IdNxb: {type: String, required: true},
    TacGia: {type: String, required: true}
});

const Sach = mongoose.model<ISach>("SACH", SACH);
export default Sach;