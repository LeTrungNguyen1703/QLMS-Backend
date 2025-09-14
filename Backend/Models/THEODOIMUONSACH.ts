import mongoose, {Schema, Document} from "mongoose";
import { IDocgia } from "./DOCGIA";
import { ISach } from "./SACH";

export interface ITHEODOIMUONSACH extends Document {
    MaDocGia: mongoose.Types.ObjectId | IDocgia,
    MaSach: mongoose.Types.ObjectId | ISach,
    NgayMuon: Date,
    NgayTra: Date,
}

const THEODOIMUONSACH = new mongoose.Schema({
    MaDocGia: {type: mongoose.Schema.Types.ObjectId, ref: 'DOCGIA', required: true},
    MaSach: {type: mongoose.Schema.Types.ObjectId, ref: 'SACH', required: true},
    NgayMuon: {type: Date, required: true, default: Date.now},
    NgayTra: {type: Date, required: true}
}, {
    timestamps: true
});

// Creating compound primary key with MaDocGia, MaSach, and NgayMuon
THEODOIMUONSACH.index({ MaDocGia: 1, MaSach: 1, NgayMuon: 1 }, { unique: true });

const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;