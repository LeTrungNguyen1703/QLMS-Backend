import DocGiaRepository from "../Repositories/DocGiaRepository";
import DocGia, {IDocgia} from "../Models/DOCGIA";
import {DocGiaRequest} from "../DTO/Request/DocGiaRequest";
import {IDocGiaResponse} from "../DTO/Response/IDocGiaResponse";
import {contentSecurityPolicy} from "helmet";
import {validate} from "class-validator";

class DocGiaService {

    async getAllDocGia(): Promise<IDocGiaResponse[]> {
        const docGias = await DocGiaRepository.findAll();
        return docGias.map(docGia => {
            return {
                ...docGia,
                _id: docGia._id?.toString() || ""
            }
        });
    }

    async getDocGiaById(id: string): Promise<IDocGiaResponse> {
        // Simply use the MaDocGia for lookup
        
        const docGia = await DocGiaRepository.findByMaDocGia(id);

        if (!docGia) {
            throw new Error("Độc giả không tồn tại");
        }
        
        return {
            ...docGia,
            _id: docGia._id?.toString() || ""
        };
    }

    async createDocGia(docGiaData: DocGiaRequest): Promise<IDocGiaResponse> {
        
        const error = await validate(docGiaData);
        
        if (error.length > 0) {
            const messages = error.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new Error(messages);
        }
        
        const savedData = await DocGiaRepository.create(docGiaData);

        return {
            ...savedData,
            _id: savedData._id?.toString() || ""
        };

    }

    async updateDocGia(id: string, docGiaData: Partial<IDocgia>) {
        // Check if doc gia exists with this MaDocGia
        const existingDocGia = await DocGiaRepository.findByMaDocGia(id);

        if (!existingDocGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Use MaDocGia to update
        return await DocGiaRepository.update(id, docGiaData);
    }

    async deleteDocGia(id: string) {
        // Check if doc gia exists with this MaDocGia
        const existingDocGia = await DocGiaRepository.findByMaDocGia(id);

        if (!existingDocGia) {
            throw new Error("Độc giả không tồn tại");
        }

        // Use MaDocGia to delete
        return await DocGiaRepository.delete(id);
    }
}

export default new DocGiaService();
