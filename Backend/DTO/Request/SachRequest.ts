import {Request} from "express";
import {IsNotEmpty, IsNumber, IsDateString, IsMongoId, Min} from 'class-validator';

export class SachRequest {
    @IsNotEmpty({ message: "Vui lòng nhập tên sách" })
    TenSach: string;

    HinhAnh?: string;

    @IsNotEmpty({ message: "Vui lòng nhập đơn giá" })
    @IsNumber({}, { message: "Đơn giá phải là số" })
    DonGia: number;

    @IsNotEmpty({ message: "Vui lòng nhập số quyển" })
    @IsNumber({}, { message: "Số quyển phải là số" })
    @Min(1, { message: "Số quyển phải lớn hơn 0" })
    SoQuyen: number;

    @IsNotEmpty({ message: "Vui lòng nhập năm xuất bản" })
    @IsDateString({}, { message: "Năm xuất bản không hợp lệ" })
    NamXuatBan: Date;

    @IsNotEmpty({ message: "Vui lòng chọn nhà xuất bản" })
    @IsMongoId({ message: "ID nhà xuất bản không hợp lệ" })
    IdNxb: string;

    @IsNotEmpty({ message: "Vui lòng nhập tên tác giả" })
    TacGia: string;
}

export interface ISachRequestExtended extends Request {
    body: SachRequest;
}
