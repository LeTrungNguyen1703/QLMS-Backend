import mongoose, {Schema, Document} from "mongoose";
import {IDocgia} from "./DOCGIA";
import {ISach} from "./SACH";

export interface ITHEODOIMUONSACH extends Document {
    _id: mongoose.Types.ObjectId,
    MaDocGia: mongoose.Types.ObjectId,
    MaSach: mongoose.Types.ObjectId,
    NgayMuon: Date,
    NgayTra: Date,
    TrangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA",
    SoQuyen: number
}

const THEODOIMUONSACH = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaDocGia: {type: mongoose.Schema.Types.ObjectId, ref: 'DOCGIA', required: true},
    MaSach: {type: mongoose.Schema.Types.ObjectId, ref: 'SACH', required: true},
    NgayMuon: {type: Date, required: true, default: Date.now},
    NgayTra: {type: Date, required: true},
    TrangThai: {type: String, enum: ["CHO_DUYET", "DA_DUYET", "DA_TRA"], default: "CHO_DUYET"},
    SoQuyen: {type: Number, required: true, default: 1}
}, {
    timestamps: true
});


const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;