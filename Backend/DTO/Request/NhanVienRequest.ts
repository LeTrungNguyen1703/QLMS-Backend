import {Request} from "express";
import {IsNotEmpty, IsEmail, IsPhoneNumber, IsIn} from 'class-validator';

export class NhanVienRequest {
    @IsNotEmpty({message: "Vui lòng nhập họ tên nhân viên"})
    HoTenNV: string;

    @IsNotEmpty({message: "Vui lòng nhập tên tài khoản"})
    TenTaiKhoan: string;
    
    @IsNotEmpty({message: "Vui lòng nhập mật khẩu"})
    MatKhau: string;

    @IsNotEmpty({message: "Vui lòng nhập địa chỉ"})
    DiaChi: string;

    @IsPhoneNumber('VN', {message: "Số điện thoại không hợp lệ"})
    @IsNotEmpty({message: "Vui lòng nhập số điện thoại"})
    SoDienThoai: string;

    @IsEmail({}, { message: "Email không hợp lệ" })
    @IsNotEmpty({ message: "Vui lòng nhập email" })
    Email : string;
}

export interface INhanVienRequestExtended extends Request {
    body: NhanVienRequest;
}
