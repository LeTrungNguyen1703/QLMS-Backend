import Sach from "../Models/SACH";
import { ISach } from "../Models/SACH";

class SachRepository {
    async findAll() {
        return await Sach.find();
    }

    async findById(id: string) {
        return Sach.findById(id);
    }
    
    async findByMaSach(MaSach: string) {
        return Sach.findOne({MaSach});
    }

    async create(sachData: Partial<ISach>) {
        const sach = new Sach(sachData);
        return await sach.save();
    }

    async update(id: string, sachData: Partial<ISach>) {
        return Sach.findByIdAndUpdate(id, sachData, {new: true});
    }

    async delete(id: string) {
        return Sach.findByIdAndDelete(id);
    }
}

export default new SachRepository();
