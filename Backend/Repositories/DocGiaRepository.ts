import DocGia from "../Models/DOCGIA";
import { IDocgia } from "../Models/DOCGIA";

class DocGiaRepository {
    async findAll() {
        return DocGia.find();
    }
    
    async findByMaDocGia(MaDocGia: string) {
        return DocGia.findOne({ MaDocGia });
    }

    async findBySoDienThoai(SoDienThoai: string) {
        return DocGia.findOne({ SoDienThoai });
    }

    async create(docGiaData: Partial<IDocgia>) {
        const docGia = new DocGia(docGiaData);
        return await docGia.save();
    }

    async update(MaDocGia: string, docGiaData: Partial<IDocgia>) {
        return DocGia.findOneAndUpdate({ MaDocGia }, docGiaData, {new: true});
    }

    async delete(MaDocGia: string) {
        return DocGia.findOneAndDelete({ MaDocGia });
    }
}

export default new DocGiaRepository();
