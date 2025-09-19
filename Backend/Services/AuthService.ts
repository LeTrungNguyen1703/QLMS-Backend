import {LoginRequest} from "../DTO/Request/AuthRequest";
import {TokenResponse} from "../DTO/Response/AuthResponse";
import {constraintToString} from "class-validator/types/validation/ValidationUtils";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import {AppError} from "../Middleware/ErrorHandler";
import {IDocgia} from "../Models/DOCGIA";
import bcrypt from "bcrypt";
import jwt, {SignOptions} from "jsonwebtoken";
import NhanVienRepository from "../Repositories/NhanVienRepository";
import Token from "../Middleware/Token";

export class AuthService {

    async loginForDocGia(loginData: LoginRequest): Promise<TokenResponse> {
        const docGia = await this.xacThucDocGia(loginData);
        return this.generateToken(docGia._id.toString(), docGia.TenTaiKhoan, docGia.Email, docGia.ChucVu)
    }

    async loginForNhanVien(loginData: LoginRequest): Promise<TokenResponse> {
        const nhanVien = await this.xacThucNhanVien(loginData);
        return this.generateToken(nhanVien._id.toString(), nhanVien.TenTaiKhoan, nhanVien.Email, nhanVien.ChucVu)
    }


    private generateToken(userId: string, userName: string, email: string, role: string): TokenResponse {
        const payload = {
            userId: userId,
            userName: userName,
            role: role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'default-secret',
            {expiresIn: process.env.JWT_EXPIRES_IN || '1h'} as SignOptions
        );
        
        return new TokenResponse(token, userName, email);
    }

    private async xacThucDocGia(loginData: LoginRequest): Promise<IDocgia> {
        const user = await DocGiaRepository.findByTenTaiKhoan(loginData.TenTaiKhoan);
        if (!user) {
            throw new AppError("Không tìm thấy đọc giả", 401);
        }

        const isPasswordValid = bcrypt.compareSync(loginData.MatKhau, user.MatKhau);
        if (!isPasswordValid) {
            throw new AppError("Mật khẩu không đúng", 401);
        }

        return user;
    }


    private async xacThucNhanVien(loginData: LoginRequest) {
        const user = await NhanVienRepository.findByTenTaiKhoan(loginData.TenTaiKhoan);
        if (!user) {
            throw new AppError("Không tìm thấy nhân viên", 401);
        }

        const isPasswordValid = bcrypt.compareSync(loginData.MatKhau, user.MatKhau);
        if (!isPasswordValid) {
            throw new AppError("Mật khẩu không đúng", 401);
        }

        return user;
    }
}