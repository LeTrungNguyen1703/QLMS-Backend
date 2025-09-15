import Sach, { ISach } from "../Models/SACH";
import { SachRequest } from "../DTO/Request/SachRequest";
import { ISachResponse } from "../DTO/Response/ISachResponse";
import { validate } from "class-validator";
import SachRepository from "../Repositories/SachRepository";

class SachService {
    async getAllSach(): Promise<ISachResponse[]> {
        const sachs = await SachRepository.findAll();
        return sachs.map(sach => {
            return {
                ...sach,
                IdNxb: sach.IdNxb._id.toString(),
                _id: sach._id?.toString() || "",
            }

        });
    }

    async getSachById(id: string): Promise<ISachResponse> {
        const sach = await SachRepository.findByMaSach(id);

        if (!sach) {
            throw new Error("Sách không tồn tại");
        }
        
        return {
            ...sach,
            IdNxb: sach.IdNxb._id.toString(),
            _id: sach._id?.toString() || ""
        };
    }

    async createSach(sachData: SachRequest): Promise<ISachResponse> {
        const errors = await validate(sachData);
        
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
            throw new Error(messages);
        }
        
        const sach = await SachRepository.create(sachData);

        return {
            ...sach,
            IdNxb: sach.IdNxb._id.toString(),
            _id: sach._id?.toString() || ""
        };
    }

    async updateSach(id: string, sachData: Partial<SachRequest>) {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);

        if (!existingSach) {
            throw new Error("Sách không tồn tại");
        }

        // Use MaSach to update
        return await SachRepository.update(id, sachData);
    }

    async deleteSach(id: string) {
        // Check if sach exists with this MaSach
        const existingSach = await SachRepository.findByMaSach(id);

        if (!existingSach) {
            throw new Error("Sách không tồn tại");
        }

        // Use MaSach to delete
        return await SachRepository.delete(id);
    }
}

export default new SachService();
