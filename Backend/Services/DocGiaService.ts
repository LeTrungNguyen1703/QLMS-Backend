import DocGiaRepository from "../Repositories/DocGiaRepository";
import { IDocgia } from "../Models/DOCGIA";

class DocGiaService {
    async getAllDocGia() {
        return await DocGiaRepository.findAll();
    }

    async getDocGiaById(id: string) {
        // Simply use the MaDocGia for lookup
        const docGia = await DocGiaRepository.findByMaDocGia(id);
        
        if (!docGia) {
            throw new Error("Độc giả không tồn tại");
        }
        
        return docGia;
    }

    async createDocGia(docGiaData: Partial<IDocgia>) {
        // Kiểm tra dữ liệu đầu vào
        if (!docGiaData.HoLot) {
            throw new Error("Vui lòng nhập họ lót");
        }
        if (!docGiaData.Ten) {
            throw new Error("Vui lòng nhập tên");
        }
        if (!docGiaData.NgaySinh) {
            throw new Error("Vui lòng chọn ngày sinh");
        }
        if (!docGiaData.Phai) {
            throw new Error("Vui lòng chọn giới tính");
        }
        if (!docGiaData.DiaChi) {
            throw new Error("Vui lòng nhập địa chỉ");
        }
        if (!docGiaData.SoDienThoai) {
            throw new Error("Vui lòng nhập số điện thoại");
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingDocGia = await DocGiaRepository.findBySoDienThoai(docGiaData.SoDienThoai);
        if (existingDocGia) {
            throw new Error("Số điện thoại đã tồn tại");
        }

        return await DocGiaRepository.create(docGiaData);
    }

    async updateDocGia(id: string, docGiaData: Partial<IDocgia>) {
        // Check if doc gia exists with this MaDocGia
        const existingDocGia = await DocGiaRepository.findByMaDocGia(id);
        
        if (!existingDocGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Use MaDocGia to update
        return await DocGiaRepository.update(id, docGiaData);
    }

    async deleteDocGia(id: string) {
        // Check if doc gia exists with this MaDocGia
        const existingDocGia = await DocGiaRepository.findByMaDocGia(id);
        
        if (!existingDocGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Use MaDocGia to delete
        return await DocGiaRepository.delete(id);
    }
}

export default new DocGiaService();
