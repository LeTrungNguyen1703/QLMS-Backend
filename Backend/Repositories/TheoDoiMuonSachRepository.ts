import TheoDoiMuonSach from "../Models/THEODOIMUONSACH";
import { ITHEODOIMUONSACH } from "../Models/THEODOIMUONSACH";

class TheoDoiMuonSachRepository {
    async findAll() {
        return TheoDoiMuonSach.find();
    }

    async findById(id: string) {
        return TheoDoiMuonSach.findById(id);
    }

    async findByDocGiaId(MaDocGia: string) {
        return TheoDoiMuonSach.find({MaDocGia});
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
}

export default new TheoDoiMuonSachRepository();
