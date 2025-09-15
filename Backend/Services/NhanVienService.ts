import NhanVienRepository from "../Repositories/NhanVienRepository";
import NhanVien, { INhanvien } from "../Models/NHANVIEN";
import { NhanVienRequest } from "../DTO/Request/NhanVienRequest";
import { INhanVienResponse } from "../DTO/Response/INhanVienResponse";
import { validate } from "class-validator";

class NhanVienService {
    async getAllNhanVien(): Promise<INhanVienResponse[]> {
        const nhanViens = await NhanVienRepository.findAll();
        return nhanViens.map(nhanVien => {
            return {
                ...nhanVien,
                _id: nhanVien._id?.toString() || ""
            }
        });
    }

    async getNhanVienById(id: string): Promise<INhanVienResponse> {
        const nhanVien = await NhanVienRepository.findByMSNV(id);

        if (!nhanVien) {
            throw new Error("Nhân viên không tồn tại");
        }
        
        return {
            ...nhanVien,
            _id: nhanVien._id?.toString() || ""
        };
    }

    async createNhanVien(nhanVienData: NhanVienRequest): Promise<INhanVienResponse> {
        const errors = await validate(nhanVienData);
        
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new Error(messages);
        }
        
        // Check if phone number is already registered
        const existingNhanVien = await NhanVienRepository.findBySoDienThoai(nhanVienData.SoDienThoai);
        if (existingNhanVien) {
            throw new Error("Số điện thoại đã được sử dụng");
        }
        
        const savedData = await NhanVienRepository.create(nhanVienData);

        return {
            ...savedData,
            _id: savedData._id?.toString() || ""
        };
    }

    async updateNhanVien(id: string, nhanVienData: Partial<INhanvien>) {
        // Check if nhan vien exists with this MSNV
        const existingNhanVien = await NhanVienRepository.findByMSNV(id);

        if (!existingNhanVien) {
            throw new Error("Nhân viên không tồn tại");
        }

        // If phone number is being updated, check if it's already in use
        if (nhanVienData.SoDienThoai && nhanVienData.SoDienThoai !== existingNhanVien.SoDienThoai) {
            const existingWithPhone = await NhanVienRepository.findBySoDienThoai(nhanVienData.SoDienThoai);
            if (existingWithPhone) {
                throw new Error("Số điện thoại đã được sử dụng");
            }
        }

        // Use MSNV to update
        return await NhanVienRepository.update(id, nhanVienData);
    }

    async deleteNhanVien(id: string) {
        // Check if nhan vien exists with this MSNV
        const existingNhanVien = await NhanVienRepository.findByMSNV(id);

        if (!existingNhanVien) {
            throw new Error("Nhân viên không tồn tại");
        }

        // Use MSNV to delete
        return await NhanVienRepository.delete(id);
    }
}

export default new NhanVienService();
