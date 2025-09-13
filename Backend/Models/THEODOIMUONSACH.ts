import mongoose, {Schema, Document} from "mongoose";

export interface ITHEODOIMUONSACH extends Document {
    IdDocGia: string,
    IdSach: string,
    NgayMuon: Date,
    NgayTra: Date,
}

const THEODOIMUONSACH = new mongoose.Schema({
    IdDocGia: {type: String, required: true},
    IdSach: {type: String, required: true},
    NgayMuon: {type: Date, required: true ,default: Date.now},
    NgayTra: {type: Date, required: true}
});

const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;