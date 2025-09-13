import DocGia from "../Models/DOCGIA";
import { IDocgia } from "../Models/DOCGIA";

class DocGiaRepository {
    async findAll() {
        return DocGia.find();
    }

    async findById(id: string) {
        return DocGia.findById(id);
    }
    
    async findByMaDocGia(MaDocGia: string) {
        return DocGia.findOne({MaDocGia});
    }

    async findBySoDienThoai(SoDienThoai: string) {
        return DocGia.findOne({SoDienThoai});
    }

    async create(docGiaData: Partial<IDocgia>) {
        const docGia = new DocGia(docGiaData);
        return await docGia.save();
    }

    async update(id: string, docGiaData: Partial<IDocgia>) {
        return DocGia.findByIdAndUpdate(id, docGiaData, {new: true});
    }

    async delete(id: string) {
        return DocGia.findByIdAndDelete(id);
    }
}

export default new DocGiaRepository();
