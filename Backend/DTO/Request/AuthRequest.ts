import {IsNotEmpty} from "class-validator";
import {Request} from 'express';

export class LoginRequest {

    @IsNotEmpty({message: "Tên tài khoản không được để trống"})
    TenTaiKhoan: string;

    @IsNotEmpty({message: "Mật khẩu không được để trống"})
    MatKhau: string;
}

export interface ILoginRequestExtended extends Request {
    body: LoginRequest;
}