import TheoDoiMuonSach from "../Models/THEODOIMUONSACH";
import {ITHEODOIMUONSACH} from "../Models/THEODOIMUONSACH";
import mongoose, {Document} from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";

class TheoDoiMuonSachRepository {
    async findAll(): Promise<ITHEODOIMUONSACH[]> {
        const muonSaches = await TheoDoiMuonSach.find()
            .populate('MaDocGia', "_id MaDocGia TenDocGia HoLot Ten")
            .populate('MaSach', "_id TenSach HinhAnh DonGia");
        return muonSaches.map(muonSach => toPlainObject(muonSach));
    }

    async findById(id: string): Promise<ITHEODOIMUONSACH | null> {
        const sachMuon = await TheoDoiMuonSach.findById(id)
            .populate('MaDocGia', "_id MaDocGia TenDocGia HoLot Ten")
            .populate('MaSach', "_id TenSach HinhAnh DonGia");
        return toPlainObject(sachMuon);
    }

    async findByDocGiaId(maDocGia: string): Promise<ITHEODOIMUONSACH[] | null> {
        const sachMuons = await TheoDoiMuonSach.find({MaDocGia: maDocGia})
            .populate('MaDocGia', "_id MaDocGia TenDocGia HoLot Ten")
            .populate('MaSach', "_id TenSach HinhAnh DonGia TacGia");
        return sachMuons.map(muonSach => toPlainObject(muonSach));
    }

    async findByMaSach(maSach: string): Promise<ITHEODOIMUONSACH[] | null> {
        const sachMuons = await TheoDoiMuonSach.find({MaSach: maSach})
            .populate('MaDocGia', "_id MaDocGia TenDocGia HoLot Ten")
            .populate('MaSach', "_id TenSach HinhAnh DonGia");
        return sachMuons.map(muonSach => toPlainObject(muonSach));
    }

    async create(sachMuon: Document & ITHEODOIMUONSACH): Promise<ITHEODOIMUONSACH> {
        const sachMuonSaved = await sachMuon.save();
        return toPlainObject(sachMuonSaved);
    }

    async update(id: string, sachMuon: Partial<ITHEODOIMUONSACH>): Promise<ITHEODOIMUONSACH | null> {
        const sachMuonUpdated = await TheoDoiMuonSach.findByIdAndUpdate(id, sachMuon, {new: true});
        return toPlainObject(sachMuonUpdated);
    }
    

    async delete(id: string): Promise<ITHEODOIMUONSACH | null> {
        const sachMuonDeleted = await TheoDoiMuonSach.findByIdAndDelete(id);
        return toPlainObject(sachMuonDeleted);
    }

    async findByCondition(param: { TrangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA" }): Promise<ITHEODOIMUONSACH[]> {
        const sachMuons = await TheoDoiMuonSach.find(param)
            .populate('MaDocGia', "_id MaDocGia TenDocGia HoLot Ten")
            .populate('MaSach', "_id TenSach HinhAnh DonGia TacGia")
            .sort({ NgayMuon: -1 }); // Sắp xếp theo ngày mượn mới nhất
        return sachMuons.map(muonSach => toPlainObject(muonSach));
    }
}

export default new TheoDoiMuonSachRepository();
