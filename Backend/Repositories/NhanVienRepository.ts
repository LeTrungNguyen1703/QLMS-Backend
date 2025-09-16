import { Model, Document, Schema } from "mongoose";
import {IDocgia} from "../Models/DOCGIA";
import NhanVien, {INhanvien} from "../Models/NHANVIEN";
import {BasicCRUDRepository} from "./BasicCRUDRepository";

class NhanVienRepository extends BasicCRUDRepository<INhanvien> {

    getModel(): Model<INhanvien> {
        return NhanVien;
    }
    
    async findBySoDienThoai(SoDienThoai: string): Promise<INhanvien | null> {
        const nhanVien = await this.getModel().findOne({ SoDienThoai });
        return nhanVien ? (nhanVien.toObject() as INhanvien) : null;
    }

    async findByCustomId(MaNhanVien: string): Promise<INhanvien | null> {
        const nhanVien = await this.getModel().findOne({ MaNhanVien });
        return nhanVien ? (nhanVien.toObject() as INhanvien) : null;
    }
    
  
}

export default new NhanVienRepository();
