import mongoose, {Schema, Document} from "mongoose";

export interface ITheodoimuonsach extends Document {
    iddocgia: string,
    idsach: string,
    ngaymuon: Date,
    ngaytra: Date,
}

const theodoimuonsach = new mongoose.Schema({
    iddocgia: {type: String, required: true},
    idsach: {type: String, required: true},
    ngaymuon: {type: Date, required: true ,default: Date.now},
    ngaytra: {type: Date, required: true}
});

const TheoDoiMuonSach = mongoose.model<ITheodoimuonsach>("theodoimuonsach", theodoimuonsach);
export default TheoDoiMuonSach;