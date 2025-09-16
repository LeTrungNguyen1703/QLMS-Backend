// filepath: c:\Users\Lenovo\WebstormProjects\QLMS\Backend\Services\NhaXuatBanService.ts
import NhaXuatBanRepository from "../Repositories/NhaXuatBanRepository";
import NHAXUATBAN, {INhaxuatban} from "../Models/NHAXUATBAN";
import {NhaXuatBanRequest} from "../DTO/Request/NhaXuatBanRequest";
import {validate} from "class-validator";
import {AppError} from "../Middleware/ErrorHandler";
import {NhaXuatBanResponse} from "../DTO/Response/NhaXuatBanResponse";
import {plainToInstance} from "class-transformer";

class NhaXuatBanService {

    async getAllNhaXuatBan(): Promise<NhaXuatBanResponse[]> {
        const nhaXuatBans = await NhaXuatBanRepository.findAll();
        return nhaXuatBans.map(nxb => this.mapToNhaXuatBanResponse(nxb));
    }

    async getNhaXuatBanByCustomId(id: string): Promise<NhaXuatBanResponse> {
        // Use the MaNXB for lookup
        const nhaXuatBan = await NhaXuatBanRepository.findByCustomId(id);

        if (!nhaXuatBan) {
            throw new AppError("Nhà xuất bản không tồn tại", 404);
        }

        return this.mapToNhaXuatBanResponse(nhaXuatBan);
    }

    async getNhaXuatBanById(id: string): Promise<NhaXuatBanResponse> {
        const nhaXuatBan = await NhaXuatBanRepository.findById(id);
        if (!nhaXuatBan) {
            throw new AppError("Nhà xuất bản không tồn tại", 404);
        }
        return this.mapToNhaXuatBanResponse(nhaXuatBan);
    }

    async createNhaXuatBan(nhaXuatBanData: NhaXuatBanRequest): Promise<NhaXuatBanResponse> {
        const error = await validate(nhaXuatBanData);

        if (error.length > 0) {
            const messages = error.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new AppError(messages, 400);
        }

        // Check if publisher with the same name already exists
        const existingNhaXuatBan = await NHAXUATBAN.findOne({TenNXB: nhaXuatBanData.TenNXB});
        if (existingNhaXuatBan) {
            throw new AppError("Tên nhà xuất bản đã tồn tại", 400);
        }

        const nhaXuatBan = new NHAXUATBAN(nhaXuatBanData);

        const savedData = await NhaXuatBanRepository.create(nhaXuatBan);

        return this.mapToNhaXuatBanResponse(savedData);
    }

    async updateNhaXuatBan(id: string, nhaXuatBanData: Partial<INhaxuatban>) {
        const nhaXuatBanUpdated = await NhaXuatBanRepository.update(id, nhaXuatBanData);
        if (!nhaXuatBanUpdated) {
            throw new AppError("Nhà xuất bản không tồn tại", 404);
        }
    }

    async deleteNhaXuatBanById(id: string) {
        const nhaXuatBanDeleted = await NhaXuatBanRepository.deleteById(id);
        if (!nhaXuatBanDeleted) {
            throw new AppError("Nhà xuất bản không tồn tại", 404);
        }
    }

    private mapToNhaXuatBanResponse(nhaXuatBan: INhaxuatban): NhaXuatBanResponse {
        const plainObject = nhaXuatBan.toObject ? nhaXuatBan.toObject() : nhaXuatBan;
        return plainToInstance(NhaXuatBanResponse, plainObject, {excludeExtraneousValues: true});
    }
}

export default new NhaXuatBanService();
