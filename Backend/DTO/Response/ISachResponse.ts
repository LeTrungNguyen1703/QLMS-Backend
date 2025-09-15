import {INhaxuatban} from "../../Models/NHAXUATBAN";

export interface ISachResponse {
    _id?: string;
    MaSach?: string;
    HinhAnh?: string;
    TenSach: string;
    DonGia: number;
    SoQuyen: number;
    NamXuatBan: Date;
    IdNxb: string | INhaxuatban;
    TacGia: string;
    createdAt?: Date;
    updatedAt?: Date;
}
