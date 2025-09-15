import NhanVien from "../Models/NHANVIEN";
import { INhanvien } from "../Models/NHANVIEN";
import { NhanVienRequest } from "../DTO/Request/NhanVienRequest";
import { Document } from "mongoose";
import { toPlainObject } from "../HelperMethods/Helpper";

class NhanVienRepository {
    async findAll(): Promise<INhanvien[]> {
        const nhanViens = await NhanVien.find();
        return nhanViens.map(nv => toPlainObject(nv));
    }
    
    async findByMSNV(MSNV: string): Promise<INhanvien | null> {
        const nhanVien = await NhanVien.findOne({ MSNV });
        return toPlainObject(nhanVien);
    }

    async findBySoDienThoai(SoDienThoai: string): Promise<INhanvien | null> {
        const nhanVien = await NhanVien.findOne({ SoDienThoai });
        return toPlainObject(nhanVien);
    }

    async create(nhanVienData: NhanVienRequest): Promise<INhanvien> {
        const nhanVien = new NhanVien(nhanVienData);
        const savedNhanVien = await nhanVien.save();
        return toPlainObject(savedNhanVien);
    }

    async update(MSNV: string, nhanVienData: Partial<INhanvien>): Promise<INhanvien | null> {
        const updatedNhanVien = await NhanVien.findOneAndUpdate({ MSNV }, nhanVienData, { new: true });
        return toPlainObject(updatedNhanVien);
    }

    async delete(MSNV: string): Promise<INhanvien | null> {
        const deletedNhanVien = await NhanVien.findOneAndDelete({ MSNV });
        return toPlainObject(deletedNhanVien);
    }

    async findById(id: string): Promise<INhanvien | null> {
        const nhanVien = await NhanVien.findById(id);
        return toPlainObject(nhanVien);
    }
}

export default new NhanVienRepository();
