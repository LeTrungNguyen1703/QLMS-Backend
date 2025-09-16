import {INhaxuatban} from "../../Models/NHAXUATBAN";
import {Expose, Transform} from "class-transformer";
import {NhaXuatBanResponse} from "./NhaXuatBanResponse";

export class SachResponse {

    @Expose()
    @Transform(({obj}) => obj._id.toString())
    _id: string;
    @Expose()
    MaSach: string;
    @Expose()
    HinhAnh?: string;
    @Expose()
    TenSach: string;
    @Expose()
    DonGia: number;
    @Expose()
    SoQuyen: number;
    @Expose()
    NamXuatBan: Date;
    @Expose()
    IdNxb: NhaXuatBanResponse;
    @Expose()
    TacGia: string;


}
