import Sach, {ISach} from "../Models/SACH";
import {SachRequest} from "../DTO/Request/SachRequest";
import {SachResponse} from "../DTO/Response/SachResponse";
import {validate} from "class-validator";
import SachRepository from "../Repositories/SachRepository";
import {AppError} from "../Middleware/ErrorHandler";
import {plainToInstance} from "class-transformer";

class SachService {

    async getAllSach(): Promise<SachResponse[]> {
        const sachs = await SachRepository.findAll();
        return sachs.map(sach => this.mapToSachResponse(sach));
    }

    async getSachById(id: string): Promise<SachResponse> {
        const sach = await SachRepository.findById(id);

        if (!sach) {
            throw new AppError("Sách không tồn tại", 404);
        }

        return this.mapToSachResponse(sach);
    }

    async createSach(sachData: SachRequest): Promise<SachResponse> {
        const errors = await validate(sachData);

        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new AppError(messages, 400);
        }
        
        const sach = new Sach(sachData);
        
        const savedSach = await SachRepository.create(sach);

        return this.mapToSachResponse(savedSach);
    }

    async updateSach(id: string, sachData: Partial<SachRequest>): Promise<SachResponse | null> {
        // Check if sach exists with this _id (MongoDB ObjectId)
        const existingSach = await SachRepository.findById(id);

        if (!existingSach) {
            throw new AppError("Sách không tồn tại", 404);
        }

        // Use the _id to update (not MaSach)
        // Cast to any to allow partial updates with mixed types
        const updatedSach = await SachRepository.update(id, sachData as any);

        if (!updatedSach) {
            throw new AppError("Cập nhật sách không thành công", 400);
        }

        return this.mapToSachResponse(updatedSach);
    }

    async deleteSach(id: string): Promise<SachResponse | null> {
        // Check if sach exists with this _id (MongoDB ObjectId)
        const existingSach = await SachRepository.findById(id);

        if (!existingSach) {
            throw new AppError("Sách không tồn tại", 404);
        }

        // Delete by _id
        const deletedSach = await SachRepository.deleteById(id);

        if (!deletedSach) {
            throw new AppError("Xóa sách không thành công", 400);
        }

        return this.mapToSachResponse(deletedSach);
    }

    private mapToSachResponse(sach: ISach): SachResponse {
        // The toObject conversion is already done in the repository layer
        return plainToInstance(SachResponse, sach, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            exposeUnsetFields: false
        });
    }
}

export default new SachService();
