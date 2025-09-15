import NhanVien from "../Models/NHANVIEN";
import { INhanvien } from "../Models/NHANVIEN";

class NhanVienRepository {
    async findAll() {
        return NhanVien.find();
    }

    async findById(id: string) {
        return NhanVien.findById(id);
    }

    async findBySoDienThoai(SoDienThoai: string) {
        return NhanVien.findOne({SoDienThoai});
    }

    async findByMSNV(MSNV: string) {
        return NhanVien.findOne({MSNV});
    }

    async create(nhanVienData: Partial<INhanvien>) {
        const nhanVien = new NhanVien(nhanVienData);
        return await nhanVien.save();
    }

    async update(MSNV: string, nhanVienData: Partial<INhanvien>) {
        return NhanVien.findOneAndUpdate({MSNV}, nhanVienData, {new: true});
    }

    async delete(MSNV: string) {
        return NhanVien.findOneAndDelete({MSNV});
    }
}

export default new NhanVienRepository();
