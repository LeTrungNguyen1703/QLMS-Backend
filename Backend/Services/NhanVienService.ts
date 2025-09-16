import NhanVienRepository from "../Repositories/NhanVienRepository";
import NhanVien, {INhanvien} from "../Models/NHANVIEN";
import {NhanVienRequest} from "../DTO/Request/NhanVienRequest";
import {NhanVienResponse} from "../DTO/Response/NhanVienResponse";
import {validate} from "class-validator";
import {AppError} from "../Middleware/ErrorHandler";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import {plainToInstance} from "class-transformer";

class NhanVienService {
    async getAllNhanVien(): Promise<NhanVienResponse[]> {
        const nhanViens = await NhanVienRepository.findAll();
        return nhanViens.map(nhanVien => this.mapToNhanVienResponse(nhanVien));
    }

    async getNhanVienById(id: string): Promise<NhanVienResponse> {
        const nhanVien = await NhanVienRepository.findById(id);

        if (!nhanVien) {
            throw new AppError("Nhân viên không tồn tại", 404);
        }

        return this.mapToNhanVienResponse(nhanVien);
    }

    async createNhanVien(nhanVienData: NhanVienRequest): Promise<NhanVienResponse> {
        const errors = await validate(nhanVienData);

        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new AppError(messages, 400);
        }

        // Check if phone number is already registered
        const existingNhanVien = await NhanVienRepository.findBySoDienThoai(nhanVienData.SoDienThoai);
        if (existingNhanVien) {
            throw new AppError("Số điện thoại đã được sử dụng", 400);
        }

        const nhanVien = new NhanVien(nhanVienData);
        const savedData = await NhanVienRepository.create(nhanVien);

        return this.mapToNhanVienResponse(savedData);
    }

    async updateNhanVien(id: string, nhanVienData: Partial<INhanvien>) {
        const existingNhanVien = await NhanVienRepository.findById(id);

        if (!existingNhanVien) {
            throw new AppError("Nhân viên không tồn tại", 404);
        }

        // If phone number is being updated, check if it's already in use
        if (nhanVienData.SoDienThoai && nhanVienData.SoDienThoai !== existingNhanVien.SoDienThoai) {
            const existingWithPhone = await NhanVienRepository.findBySoDienThoai(nhanVienData.SoDienThoai);
            if (existingWithPhone) {
                throw new AppError("Số điện thoại đã được sử dụng", 400);
            }
        }

        await NhanVienRepository.update(id, nhanVienData);
    }

    async deleteNhanVien(id: string) {
        const nhanVienDeleted = await NhanVienRepository.deleteById(id);
        if (!nhanVienDeleted) {
            throw new AppError("Nhân viên không tồn tại", 404);
        }
    }

    private mapToNhanVienResponse(nhanVien: INhanvien): NhanVienResponse {
        const plainObject = nhanVien.toObject ? nhanVien.toObject() : nhanVien;
        return plainToInstance(NhanVienResponse,plainObject, {excludeExtraneousValues: true});
    }
}

export default new NhanVienService();
