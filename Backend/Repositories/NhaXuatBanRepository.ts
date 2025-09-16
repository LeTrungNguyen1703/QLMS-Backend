import {BasicCRUDRepository} from "./BasicCRUDRepository";
import NHAXUATBAN, {INhaxuatban} from "../Models/NHAXUATBAN";
import {Model} from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";


class NhaXuatBanRepository extends BasicCRUDRepository<INhaxuatban>{

    getModel(): Model<INhaxuatban> {
        return NHAXUATBAN;
    }
    
    async findByCustomId(MaNhaXuatBan: string): Promise<INhaxuatban | null> {
        const nhaXuatBan = await NHAXUATBAN.findOne({ MaNhaXuatBan });
        return toPlainObject(nhaXuatBan);
    }
   
}

export default new NhaXuatBanRepository();
