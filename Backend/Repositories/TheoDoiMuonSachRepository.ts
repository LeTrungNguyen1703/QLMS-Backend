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

    async findByDocGiaId(maDocGia: string) {
        return TheoDoiMuonSach.find({ MaDocGia: maDocGia });
    }
    
    async findByMaSach(maSach: string) {
        return TheoDoiMuonSach.find({ MaSach: maSach });
    }
    
    async findByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date) {
        return TheoDoiMuonSach.findOne({
            MaDocGia: maDocGia,
            MaSach: maSach,
            NgayMuon: ngayMuon
        });
    }

    async create(muonSachData: Partial<ITHEODOIMUONSACH>) {
        const muonSach = new TheoDoiMuonSach(muonSachData);
        return await muonSach.save();
    }

    async update(criteria: { MaDocGia: string, MaSach: string, NgayMuon: Date }, muonSachData: Partial<ITHEODOIMUONSACH>) {
        return TheoDoiMuonSach.findOneAndUpdate(criteria, muonSachData, {new: true});
    }

    async delete(criteria: { MaDocGia: string, MaSach: string, NgayMuon: Date }) {
        return TheoDoiMuonSach.findOneAndDelete(criteria);
    }
    
    // Backward compatibility method that will be deprecated
    async updateById(id: string, muonSachData: Partial<ITHEODOIMUONSACH>) {
        return TheoDoiMuonSach.findByIdAndUpdate(id, muonSachData, {new: true});
    }
    
    // Backward compatibility method that will be deprecated
    async deleteById(id: string) {
        return TheoDoiMuonSach.findByIdAndDelete(id);
    }
    
}

export default new TheoDoiMuonSachRepository();
