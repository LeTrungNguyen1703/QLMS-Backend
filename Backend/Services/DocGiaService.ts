import DocGiaRepository from "../Repositories/DocGiaRepository";
import DocGia, {IDocgia} from "../Models/DOCGIA";
import {DocGiaRequest} from "../DTO/Request/DocGiaRequest";
import {DocGiaResponse} from "../DTO/Response/DocGiaResponse";
import {validate} from "class-validator";
import {AppError} from "../Middleware/ErrorHandler";
import {plainToInstance} from "class-transformer";

class DocGiaService {

    async getAllDocGia(): Promise<DocGiaResponse[]> {
        const docGias = await DocGiaRepository.findAll();
        return docGias.map(docGia => this.mapToDocGiaResponse(docGia));
    }

    async getDocGiaByCustomId(id: string): Promise<DocGiaResponse> {
        // Simply use the MaDocGia for lookup
        const docGia = await DocGiaRepository.findByCustomId(id);

        if (!docGia) {
            throw new AppError("Độc giả không tồn tại", 404);
        }
        
        return this.mapToDocGiaResponse(docGia);
    }
    
    async getDocGiaById(id: string): Promise<DocGiaResponse> {
        const docGia = await DocGiaRepository.findById(id);
        if (!docGia) {
            throw new AppError("Độc giả không tồn tại", 404);
        }
        return this.mapToDocGiaResponse(docGia);
    }

    async createDocGia(docGiaData: DocGiaRequest): Promise<DocGiaResponse> {
        const error = await validate(docGiaData);
        
        if (error.length > 0) {
            const messages = error.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new AppError(messages, 400);
        }
        
        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingDocGia = await DocGiaRepository.findBySoDienThoai(docGiaData.SoDienThoai);
        if (existingDocGia) {
            throw new AppError("Số điện thoại đã được sử dụng", 400);
        }
        
        const docGia = new DocGia(docGiaData);
        
        const savedData = await DocGiaRepository.create(docGia);

        return this.mapToDocGiaResponse(savedData);
    }

    async updateDocGia(id: string, docGiaData: Partial<IDocgia>) {
        const docGiaUpdated = await DocGiaRepository.update(id,docGiaData);
        if (!docGiaUpdated) {
            throw new AppError("Độc giả không tồn tại", 404);
        }
    }

    async deleteDocGiaById(id: string) {
        const docGiaDeleted = await DocGiaRepository.deleteById(id);
        if (!docGiaDeleted) {
            throw new AppError("Độc giả không tồn tại", 404);
        }
    }

    private mapToDocGiaResponse(docGia: IDocgia): DocGiaResponse {
        const plainObject = docGia.toObject ? docGia.toObject() : docGia;
        return plainToInstance(DocGiaResponse, plainObject, {excludeExtraneousValues: true});
    }
}

export default new DocGiaService();
