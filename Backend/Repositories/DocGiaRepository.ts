import {Document, Model} from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";
import DOCGIA, {IDocgia} from "../Models/DOCGIA";
import {IBasicCRUD} from "./IBasicCRUD";
import {BasicCRUDRepository} from "./BasicCRUDRepository";

class DocGiaRepository extends BasicCRUDRepository<IDocgia> {

    getModel(): Model<IDocgia> {
        return DOCGIA;
    }
    
    async findBySoDienThoai(SoDienThoai: string): Promise<IDocgia | null> {
        const docGia = await DOCGIA.findOne({ SoDienThoai });
        return toPlainObject(docGia);
    }
    
    async findByCustomId(MaDocGia: string): Promise<IDocgia | null> {
        const docGia = await DOCGIA.findOne({ MaDocGia });
        return toPlainObject(docGia);
    }
    
    async findByTenTaiKhoan(TenTaiKhoan: string): Promise<IDocgia | null> {
        const docGia = await DOCGIA.findOne({ TenTaiKhoan });
        return toPlainObject(docGia);
    }

   
}

export default new DocGiaRepository();
