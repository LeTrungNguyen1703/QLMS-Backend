import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import SachRepository from "../Repositories/SachRepository";
import { ITHEODOIMUONSACH } from "../Models/THEODOIMUONSACH";
import mongoose from "mongoose";

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
        const docGia = await DocGiaRepository.findById(muonSachData.MaDocGia.toString());
        if (!docGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Kiểm tra sách có tồn tại không
        const sach = await SachRepository.findById(muonSachData.MaSach.toString());
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
        const sach = await SachRepository.findById(existingMuonSach.MaSach.toString());
        if (sach) {
            sach.SoQuyen += 1;
            await sach.save();
        }

        return await TheoDoiMuonSachRepository.delete(id);
    }

    /**
     * Lấy thông tin mượn sách theo khóa chính phức hợp
     */
    async getMuonSachByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date) {
        const muonSach = await TheoDoiMuonSachRepository.findByCompoundKey(maDocGia, maSach, ngayMuon);
        if (!muonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }
        return muonSach;
    }

    /**
     * Cập nhật thông tin mượn sách theo khóa chính phức hợp
     */
    async updateMuonSachByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date, muonSachData: Partial<ITHEODOIMUONSACH>) {
        const existingMuonSach = await TheoDoiMuonSachRepository.findByCompoundKey(maDocGia, maSach, ngayMuon);
        if (!existingMuonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }

        return await TheoDoiMuonSachRepository.updateByCompoundKey(maDocGia, maSach, ngayMuon, muonSachData);
    }

    /**
     * Xóa thông tin mượn sách theo khóa chính phức hợp
     */
    async deleteMuonSachByCompoundKey(maDocGia: string, maSach: string, ngayMuon: Date) {
        const existingMuonSach = await TheoDoiMuonSachRepository.findByCompoundKey(maDocGia, maSach, ngayMuon);
        if (!existingMuonSach) {
            throw new Error("Thông tin mượn sách không tồn tại");
        }

        // Tăng số lượng sách khi xóa phiếu mượn
        const sach = await SachRepository.findById(existingMuonSach.MaSach.toString());
        if (sach) {
            sach.SoQuyen += 1;
            await sach.save();
        }

        return await TheoDoiMuonSachRepository.deleteByCompoundKey(maDocGia, maSach, ngayMuon);
    }
}

export default new TheoDoiMuonSachService();
