import {LoginRequest} from "../DTO/Request/AuthRequest";
import {TokenResponse} from "../DTO/Response/AuthResponse";
import {constraintToString} from "class-validator/types/validation/ValidationUtils";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import {AppError} from "../Middleware/ErrorHandler";
import {IDocgia} from "../Models/DOCGIA";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NhanVienRepository from "../Repositories/NhanVienRepository";

export class AuthService {

    async loginForDocGia(loginData: LoginRequest): Promise<TokenResponse> {
        const docGia = await this.xacThucDocGia(loginData);
        return this.generateToken(docGia._id.toString(), docGia.ChucVu)
    }

    async loginForNhanVien(loginData: LoginRequest): Promise<TokenResponse> {
        const nhanVien = await this.xacThucNhanVien(loginData);
        return this.generateToken(nhanVien._id.toString(), nhanVien.ChucVu)
    }


    private generateToken(userId: string, role: string): TokenResponse {
        const token = jwt.sign(
            {
                userId: userId,
                role: role
            },
            process.env.JWT_SECRET || 'default-secret',
            {expiresIn: '24h'}
        );
        return {Token: token};
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