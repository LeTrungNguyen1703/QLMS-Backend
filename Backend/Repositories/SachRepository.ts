import Sach from "../Models/SACH";
import { ISach } from "../Models/SACH";
import { SachRequest } from "../DTO/Request/SachRequest";
import { Document } from "mongoose";
import { toPlainObject } from "../HelperMethods/Helpper";

class SachRepository {
    async findAll(): Promise<ISach[]> {
        const sachs = await Sach.find().populate('IdNxb');
        return sachs.map(sach => toPlainObject(sach));
    }
    
    async findByMaSach(MaSach: string): Promise<ISach | null> {
        const sach = await Sach.findOne({ MaSach }).populate('IdNxb');
        return toPlainObject(sach);
    }

    async create(sachData: SachRequest): Promise<ISach> {
        const sach = new Sach(sachData);
        const savedSach = await sach.save();
        const populatedSach = await Sach.findById(savedSach._id).populate('IdNxb');
        return toPlainObject(populatedSach);
    }

    async update(MaSach: string, sachData: Partial<SachRequest>): Promise<ISach | null> {
        const updatedSach = await Sach.findOneAndUpdate({ MaSach }, sachData, { new: true }).populate('IdNxb');
        return toPlainObject(updatedSach);
    }

    async delete(MaSach: string): Promise<ISach | null> {
        const deletedSach = await Sach.findOneAndDelete({ MaSach });
        return toPlainObject(deletedSach);
    }

    async findById(id: string): Promise<ISach | null> {
        const sach = await Sach.findById(id).populate('IdNxb');
        return toPlainObject(sach);
    }
}

export default new SachRepository();
