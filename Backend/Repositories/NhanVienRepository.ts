import {Model, Document, Schema} from "mongoose";
import {IDocgia} from "../Models/DOCGIA";
import NhanVien, {INhanvien} from "../Models/NHANVIEN";
import {BasicCRUDRepository} from "./BasicCRUDRepository";
import {toPlainObject} from "../HelperMethods/Helpper";

class NhanVienRepository extends BasicCRUDRepository<INhanvien> {

    getModel(): Model<INhanvien> {
        return NhanVien;
    }

    async findBySoDienThoai(SoDienThoai: string): Promise<INhanvien | null> {
        const nhanVien = await this.getModel().findOne({SoDienThoai});
        return toPlainObject(nhanVien);
    }

    async findByCustomId(MaNhanVien: string): Promise<INhanvien | null> {
        const nhanVien = await this.getModel().findOne({MaNhanVien});
        return toPlainObject(nhanVien);
    }


    async findByTenTaiKhoan(TenTaiKhoan: string) : Promise<INhanvien | null> {
        const nhanVien = await this.getModel().findOne({TenTaiKhoan: TenTaiKhoan});
        return toPlainObject(nhanVien);
    }
}

export default new NhanVienRepository();
