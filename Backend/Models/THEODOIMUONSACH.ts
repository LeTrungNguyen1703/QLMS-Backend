import mongoose, {Schema, Document} from "mongoose";
import DOCGIA, {IDocgia} from "./DOCGIA";
import {ISach} from "./SACH";
import {TrangThai} from "../Enums/TrangThai";

export interface ITHEODOIMUONSACH extends Document {
    _id: mongoose.Types.ObjectId,
    MaDocGia: mongoose.Types.ObjectId,
    MaSach: mongoose.Types.ObjectId,
    NgayMuon: Date,
    NgayTra: Date,
    TrangThai: TrangThai.CHO_DUYET | TrangThai.DA_DUYET | TrangThai.DA_TRA,
    SoQuyen: number,
    PhatQuaHan: {
        message: String,
        SoTienPhat: number
    },
}

const THEODOIMUONSACH = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    MaDocGia: {type: mongoose.Schema.Types.ObjectId, ref: 'DOCGIA', required: true},
    MaSach: {type: mongoose.Schema.Types.ObjectId, ref: 'SACH', required: true},
    NgayMuon: {type: Date, required: true, default: Date.now},
    NgayTra: {type: Date, required: true},
    TrangThai: {
        type: String,
        enum: [TrangThai.CHO_DUYET, TrangThai.DA_DUYET, TrangThai.DA_TRA],
        default: TrangThai.CHO_DUYET
    },
    SoQuyen: {type: Number, required: true, default: 1},
    PhatQuaHan: {
        message: {type: String, default: "Chưa đến hạn trả sách"},
        SoTienPhat: {type: Number, default: 0}
    }
}, {
    timestamps: true
});


const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;