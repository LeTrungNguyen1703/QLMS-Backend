import mongoose, {Schema, Document} from "mongoose";

export interface ISach extends Document {
    hinhanh: string,
    tensach: string,
    dongia: number,
    soquyen: number,
    namxuatban: Date,
    idnxb: string,
    tacgia: string
}

const sach = new mongoose.Schema({
    hinhanh: {type: String, required: false},
    tensach: {type: String, required: true},
    dongia: {type: Number, required: true},
    soquyen: {type: Number, required: true},
    namxuatban: {type: Date, required: true},
    idnxb: {type: String, required: true},
    tacgia: {type: String, required: true}
});

const Sach = mongoose.model<ISach>("sach", sach);
export default Sach;