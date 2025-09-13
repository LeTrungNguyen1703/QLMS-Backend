import TheoDoiMuonSach from "../Models/THEODOIMUONSACH";
import { ITHEODOIMUONSACH } from "../Models/THEODOIMUONSACH";

class TheoDoiMuonSachRepository {
    async findAll() {
        return await TheoDoiMuonSach.find();
    }

    async findById(id: string) {
        return await TheoDoiMuonSach.findById(id);
    }

    async findByDocGiaId(IdDocGia: string) {
        return await TheoDoiMuonSach.find({ IdDocGia });
    }

    async findBySachId(IdSach: string) {
        return await TheoDoiMuonSach.find({ IdSach });
    }

    async create(muonSachData: Partial<ITHEODOIMUONSACH>) {
        const muonSach = new TheoDoiMuonSach(muonSachData);
        return await muonSach.save();
    }

    async update(id: string, muonSachData: Partial<ITHEODOIMUONSACH>) {
        return await TheoDoiMuonSach.findByIdAndUpdate(id, muonSachData, { new: true });
    }

    async delete(id: string) {
        return await TheoDoiMuonSach.findByIdAndDelete(id);
    }
}

export default new TheoDoiMuonSachRepository();
