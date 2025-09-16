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
        const sach = await SachRepository.findByMaSach(id);

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
        // sach.IdNxb = 
        // const savedSach = await SachRepository.create(populatedSach);

        return this.mapToSachResponse(sach);
    }

    async updateSach(id: string, sachData: Partial<SachRequest>): Promise<SachResponse | null> {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);

        if (!existingSach) {
            throw new AppError("Sách không tồn tại", 404);
        }

        // Use MaSach to update
        const updatedSach = await SachRepository.update(id, sachData);

        if (!updatedSach) {
            return null;
        }

        return this.mapToSachResponse(updatedSach);
    }

    async deleteSach(id: string): Promise<SachResponse | null> {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);

        if (!existingSach) {
            throw new AppError("Sách không tồn tại", 404);
        }

        // Use MaSach to delete
        const deletedSach = await SachRepository.delete(id);

        if (!deletedSach) {
            return null;
        }

        return this.mapToSachResponse(deletedSach);
    }

    private mapToSachResponse(sach: ISach): SachResponse {
        const plainObject = sach.toObject ? sach.toObject() : sach;

        return plainToInstance(SachResponse, plainObject, {excludeExtraneousValues: true});
    }
}

export default new SachService();
