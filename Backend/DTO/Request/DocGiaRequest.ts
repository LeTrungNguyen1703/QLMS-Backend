import {Request} from "express";
import { IsNotEmpty, IsEmail, IsPhoneNumber, IsIn } from 'class-validator';

export class DocGiaRequest {
    @IsNotEmpty({ message: "Vui lòng nhập họ lót" })
    HoLot: string;

    @IsNotEmpty({ message: "Vui lòng nhập tên" })
    Ten: string;
    
    @IsNotEmpty({message: "Vui lòng nhập tên tài khoản"})
    TenTaiKhoan: string;
    
    @IsNotEmpty({message: "Vui lòng nhập mật khẩu"})
    MatKhau: string;

    @IsNotEmpty({ message: "Vui lòng chọn ngày sinh" })
    NgaySinh: Date;

    @IsIn(['nam', 'nữ', 'khác'], { message: "Giới tính không hợp lệ" })
    Phai: "nam" | "nữ" | "khác";

    @IsNotEmpty({ message: "Vui lòng nhập địa chỉ" })
    DiaChi: string;

    @IsPhoneNumber('VN', { message: "Số điện thoại không hợp lệ" })
    @IsNotEmpty({ message: "Vui lòng nhập số điện thoại" })
    SoDienThoai: string;
    
    @IsEmail({}, { message: "Email không hợp lệ" })
    @IsNotEmpty({ message: "Vui lòng nhập email" })
    Email : string;
}
export interface IDocGiaRequestExtended extends Request {
    body: DocGiaRequest;
}