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

    async create(nhanVienData: Partial<INhanvien>) {
        const nhanVien = new NhanVien(nhanVienData);
        return await nhanVien.save();
    }

    async update(id: string, nhanVienData: Partial<INhanvien>) {
        return NhanVien.findByIdAndUpdate(id, nhanVienData, {new: true});
    }

    async delete(id: string) {
        return NhanVien.findByIdAndDelete(id);
    }
}

export default new NhanVienRepository();
