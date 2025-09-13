import mongoose, {Schema, Document} from "mongoose";

export interface ITHEODOIMUONSACH extends Document {
    iddocgia: string,
    idsach: string,
    ngaymuon: Date,
    ngaytra: Date,
}

const THEODOIMUONSACH = new mongoose.Schema({
    iddocgia: {type: String, required: true},
    idsach: {type: String, required: true},
    ngaymuon: {type: Date, required: true ,default: Date.now},
    ngaytra: {type: Date, required: true}
});

const TheoDoiMuonSach = mongoose.model<ITHEODOIMUONSACH>("THEODOIMUONSACH", THEODOIMUONSACH);
export default TheoDoiMuonSach;