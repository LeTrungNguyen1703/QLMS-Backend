import DocGia from "../Models/DOCGIA";
import { IDocgia } from "../Models/DOCGIA";
import {DocGiaRequest} from "../DTO/Request/DocGiaRequest";
import { Document } from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";

class DocGiaRepository {
    async findAll(): Promise<IDocgia[]> {
        const docs = await DocGia.find();
        return docs.map(doc => toPlainObject(doc));
    }
    
    async findByMaDocGia(MaDocGia: string): Promise<IDocgia | null> {
        const doc = await DocGia.findOne({ MaDocGia });
        return toPlainObject(doc);
    }

    async findBySoDienThoai(SoDienThoai: string): Promise<IDocgia | null> {
        const doc = await DocGia.findOne({ SoDienThoai });
        return toPlainObject(doc);
    }

    async create(docGiaData: DocGiaRequest): Promise<IDocgia> {
        const docGia = new DocGia(docGiaData);
        const savedDoc = await docGia.save();
        return toPlainObject(savedDoc);
    }

    async update(MaDocGia: string, docGiaData: Partial<IDocgia>): Promise<IDocgia | null> {
        const updatedDoc = await DocGia.findOneAndUpdate({ MaDocGia }, docGiaData, {new: true});
        return toPlainObject(updatedDoc);
    }

    async delete(MaDocGia: string): Promise<IDocgia | null> {
        const deletedDoc = await DocGia.findOneAndDelete({ MaDocGia });
        return toPlainObject(deletedDoc);
    }

    async findById(id: string): Promise<IDocgia | null> {
        const doc = await DocGia.findById(id);
        return toPlainObject(doc);
    }
}

export default new DocGiaRepository();
