import SachRepository from "../Repositories/SachRepository";
import { ISach } from "../Models/SACH";

class SachService {
    async getAllSach() {
        return await SachRepository.findAll();
    }

    async getSachById(id: string) {
        // Simply use the MaSach for lookup
        const sach = await SachRepository.findByMaSach(id);
        
        if (!sach) {
            throw new Error("Sách không tồn tại");
        }
        
        return sach;
    }

    async createSach(sachData: Partial<ISach>) {
        // Kiểm tra dữ liệu đầu vào
        if (!sachData.TenSach) {
            throw new Error("Vui lòng nhập tên sách");
        }
        if (!sachData.DonGia) {
            throw new Error("Vui lòng nhập đơn giá sách");
        }
        if (!sachData.SoQuyen) {
            throw new Error("Vui lòng nhập số lượng sách");
        }
        if (!sachData.NamXuatBan) {
            throw new Error("Vui lòng chọn năm xuất bản sách");
        }
        if (!sachData.IdNxb) {
            throw new Error("Vui lòng chọn nhà xuất bản sách");
        }
        if (!sachData.TacGia) {
            throw new Error("Vui lòng chọn tác giả sách");
        }

        return await SachRepository.create(sachData);
    }

    async updateSach(id: string, sachData: Partial<ISach>) {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);
        
        if (!existingSach) {
            throw new Error("Sách không tồn tại");
        }

        // Use MaSach to update
        return await SachRepository.update(id, sachData);
    }

    async deleteSach(id: string) {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);
        
        if (!existingSach) {
            throw new Error("Sách không tồn tại");
        }

        // Use MaSach to delete
        return await SachRepository.delete(id);
    }
}

export default new SachService();
