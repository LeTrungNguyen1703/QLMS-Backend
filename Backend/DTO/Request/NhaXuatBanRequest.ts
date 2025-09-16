import {IsNotEmpty} from "class-validator";
import {Request} from "express";
import {DocGiaRequest} from "./DocGiaRequest";


export class NhaXuatBanRequest {
    
    @IsNotEmpty({message: "Vui lòng nhập tên nhà xuất bản"})
    TenNXB: string;
    
    @IsNotEmpty({message: "Vui lòng nhập địa chỉ nhà xuất bản"})
    DiaChi: string
}

export interface INhaXuatBanRequestExtended extends Request {
    body: NhaXuatBanRequest;
}