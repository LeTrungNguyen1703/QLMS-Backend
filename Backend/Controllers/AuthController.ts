import {Request, Response, NextFunction} from 'express';
import {AuthService} from '../Services/AuthService';
import {ILoginRequestExtended, LoginRequest} from '../DTO/Request/AuthRequest';
import {APIResponse} from '../DTO/Response/APIResponse';
import {TokenResponse} from '../DTO/Response/AuthResponse';
import {plainToInstance} from "class-transformer";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Login cho đọc giả
    loginDocGia = async (req: ILoginRequestExtended, res: Response<APIResponse<TokenResponse>>) => {
        const plainData = req.body;
        const dto = plainToInstance(LoginRequest, plainData);

        const tokenResponse: TokenResponse = await this.authService.loginForDocGia(dto);

        const response: APIResponse<TokenResponse> = {
            message: 'Đăng nhập thành công',
            data: tokenResponse
        };

        res.status(200).json(response);
    };

    // Login cho nhân viên
    loginNhanVien = async (req: ILoginRequestExtended, res: Response<APIResponse<TokenResponse>>) => {
        const loginData: LoginRequest = req.body;
        const tokenResponse: TokenResponse = await this.authService.loginForNhanVien(loginData);

        const response: APIResponse<TokenResponse> = {
            message: 'Đăng nhập thành công',
            data: tokenResponse
        };

        res.status(200).json(response);

    };

    // Lấy thông tin user hiện tại
    getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Không tìm thấy thông tin user'
                });
            }

            const response: APIResponse<any> = {
                message: 'Lấy thông tin user thành công',
                data: {
                    userId: req.user.userId,
                    userName: req.user.userName,
                    email: req.user.email,
                    role: req.user.role
                }
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
