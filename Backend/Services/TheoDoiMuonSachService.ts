import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import SachRepository from "../Repositories/SachRepository";
import { ITHEODOIMUONSACH } from "../Models/THEODOIMUONSACH";

class TheoDoiMuonSachService {
    async getAllMuonSach() {
        return await TheoDoiMuonSachRepository.findAll();
    }

    async getMuonSachById(id: string) {
        const muonSach = await TheoDoiMuonSachRepository.findById(id);
        if (!muonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }
        return muonSach;
    }

    async getMuonSachByDocGiaId(docGiaId: string) {
        return await TheoDoiMuonSachRepository.findByDocGiaId(docGiaId);
    }

    async createMuonSach(muonSachData: Partial<ITHEODOIMUONSACH>) {
        // Kiểm tra dữ liệu đầu vào
        if (!muonSachData.MaDocGia) {
            throw new Error("Vui lòng chọn độc giả");
        }
        if (!muonSachData.MaSach) {
            throw new Error("Vui lòng chọn sách");
        }
        if (!muonSachData.NgayMuon) {
            throw new Error("Vui lòng chọn ngày mượn");
        }
        if (!muonSachData.NgayTra) {
            throw new Error("Vui lòng chọn ngày trả");
        }

        // Kiểm tra độc giả có tồn tại không
        const docGia = await DocGiaRepository.findByMaDocGia(muonSachData.MaDocGia);
        if (!docGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Kiểm tra sách có tồn tại không
        const sach = await SachRepository.findByMaSach(muonSachData.MaSach);
        if (!sach) {
            throw new Error("Sách không tồn tại");
        }

        // Kiểm tra số lượng sách còn đủ không
        if (sach.SoQuyen <= 0) {
            throw new Error("Sách đã hết");
        }

        // Giảm số lượng sách
        sach.SoQuyen -= 1;
        await sach.save();

        return await TheoDoiMuonSachRepository.create(muonSachData);
    }

    async updateMuonSach(id: string, muonSachData: Partial<ITHEODOIMUONSACH>) {
        const existingMuonSach = await TheoDoiMuonSachRepository.findById(id);
        if (!existingMuonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }

        return await TheoDoiMuonSachRepository.update(id, muonSachData);
    }

    async deleteMuonSach(id: string) {
        const existingMuonSach = await TheoDoiMuonSachRepository.findById(id);
        if (!existingMuonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }

        // Tăng số lượng sách khi xóa phiếu mượn
        const sach = await SachRepository.findByMaSach(existingMuonSach.MaSach);
        if (sach) {
            sach.SoQuyen += 1;
            await sach.save();
        }

        return await TheoDoiMuonSachRepository.delete(id);
    }
}

export default new TheoDoiMuonSachService();
