import Sach from "../Models/SACH";
import {ISach} from "../Models/SACH";
import {SachRequest} from "../DTO/Request/SachRequest";
import {Document} from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";

class SachRepository {
    async findAll(): Promise<ISach[]> {
        const sachs = await Sach.find().populate('IdNxb');
        return sachs.map(sach => toPlainObject(sach));
    }

    async findByMaSach(MaSach: string): Promise<ISach | null> {
        const sach = await Sach.findOne({MaSach}).populate('IdNxb');
        return toPlainObject(sach);
    }

    async create(sach: Document & ISach): Promise<ISach> {
        const savedSach = await sach.save();
        return toPlainObject(savedSach);
    }

    async update(id: string, sachData: Partial<ISach>): Promise<ISach | null> {
        // Use $set to only update provided fields, and populate IdNxb
        const updatedSach = await Sach.findByIdAndUpdate(
            id,
            { $set: sachData },
            { new: true, runValidators: true }
        ).populate('IdNxb');
        return toPlainObject(updatedSach);
    }

    async delete(MaSach: string): Promise<ISach | null> {
        const deletedSach = await Sach.findOneAndDelete({MaSach});
        return toPlainObject(deletedSach);
    }

    async deleteById(id: string): Promise<ISach | null> {
        const deletedSach = await Sach.findByIdAndDelete(id);
        return toPlainObject(deletedSach);
    }

    async findById(id: string): Promise<ISach | null> {
        const sach = await Sach.findById(id).populate('IdNxb');
        return toPlainObject(sach);
    }
    
    async findByTenSach(tenSach: string): Promise<ISach | null> {
        const sach = await Sach.findOne({TenSach: tenSach})
        
        return toPlainObject(sach);
    }
}

export default new SachRepository();
