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

    async searchDocGia(searchQuery: string): Promise<IDocgia | null> {
        // Search by MaDocGia (exact match) or by name (partial match)
        const docGia = await DOCGIA.findOne({
            $or: [
                { MaDocGia: searchQuery },
                { HoLot: { $regex: searchQuery, $options: 'i' } },
                { Ten: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        return toPlainObject(docGia);
    }

}

export default new DocGiaRepository();
