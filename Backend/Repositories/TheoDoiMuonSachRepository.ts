import TheoDoiMuonSach from "../Models/THEODOIMUONSACH";
import { ITHEODOIMUONSACH } from "../Models/THEODOIMUONSACH";
import mongoose from "mongoose";

class TheoDoiMuonSachRepository {
    async findAll() {
        return TheoDoiMuonSach.find();
    }

    async findById(id: string) {
        return TheoDoiMuonSach.findById(id);
    }

    async findByDocGiaId(docGiaId: string) {
        return TheoDoiMuonSach.find({
            MaDocGia: new mongoose.Types.ObjectId(docGiaId)
        });
    }

    async create(muonSachData: Partial<ITHEODOIMUONSACH>) {
        const muonSach = new TheoDoiMuonSach(muonSachData);
        return await muonSach.save();
    }

    async update(id: string, muonSachData: Partial<ITHEODOIMUONSACH>) {
        return TheoDoiMuonSach.findByIdAndUpdate(id, muonSachData, {new: true});
    }

    async delete(id: string) {
        return TheoDoiMuonSach.findByIdAndDelete(id);
    }

    /**
     * Tìm kiếm theo khóa chính phức hợp (MaDocGia, MaSach, NgayMuon)
     */
    async findByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date) {
        return TheoDoiMuonSach.findOne({
            MaDocGia: new mongoose.Types.ObjectId(maDocGia),
            MaSach: new mongoose.Types.ObjectId(maSach),
            NgayMuon: ngayMuon
        });
    }

    /**
     * Cập nhật theo khóa chính phức hợp (MaDocGia, MaSach, NgayMuon)
     */
    async updateByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date, muonSachData: Partial<ITHEODOIMUONSACH>) {
        return TheoDoiMuonSach.findOneAndUpdate({
            MaDocGia: new mongoose.Types.ObjectId(maDocGia),
            MaSach: new mongoose.Types.ObjectId(maSach),
            NgayMuon: ngayMuon
        }, muonSachData, { new: true });
    }

    /**
     * Xóa theo khóa chính phức hợp (MaDocGia, MaSach, NgayMuon)
     */
    async deleteByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date) {
        return TheoDoiMuonSach.findOneAndDelete({
            MaDocGia: new mongoose.Types.ObjectId(maDocGia),
            MaSach: new mongoose.Types.ObjectId(maSach),
            NgayMuon: ngayMuon
        });
    }
}

export default new TheoDoiMuonSachRepository();
