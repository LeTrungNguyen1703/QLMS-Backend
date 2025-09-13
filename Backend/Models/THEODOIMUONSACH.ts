import mongoose, {Schema, Document} from "mongoose";

export interface ITHEODOIMUONSACH extends Document {
    MaDocGia: string,
    MaSach: string,
    NgayMuon: Date,
    NgayTra: Date,
}

const THEODOIMUONSACH = new mongoose.Schema({
    MaDocGia: {type: String, required: true},
    MaSach: {type: String, required: true},
    NgayMuon: {type: Date, required: true, default: Date.now},
    NgayTra: {type: Date, required: true}
}, {
    timestamps: true
});


const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;