import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './ErrorHandler';
import {UserRole} from "../Enums/UserRole";

// Extend Request interface để thêm user info
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

export class TokenMiddleware {
    
    // Middleware xác thực token
    static authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy token từ header Authorization
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                throw new AppError('Không có token, truy cập bị từ chối', 401);
            }

            // Token format: "Bearer <token>"
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            if (!token) {
                throw new AppError('Token không hợp lệ', 401);
            }

            // Verify token
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'default-secret'
            ) as { userId: string; role: string };

            // Gắn thông tin user vào request
            req.user = {
                userId: decoded.userId,
                role: decoded.role
            };
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                next(new AppError('Token không hợp lệ', 401));
            } else if (error instanceof jwt.TokenExpiredError) {
                next(new AppError('Token đã hết hạn', 401));
            } else {
                next(error);
            }
        }
    }

    // Middleware phân quyền theo role
    static authorize(...allowedRoles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    throw new AppError('Chưa được xác thực', 401);
                }

                if (!allowedRoles.includes(req.user.role)) {
                    throw new AppError('Không có quyền truy cập', 403);
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }

    // Middleware kiểm tra quyền truy cập tài nguyên của chính user
    static authorizeOwner(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Chưa được xác thực', 401);
            }

            // Kiểm tra nếu user đang truy cập tài nguyên của chính mình
            const resourceUserId = req.params.id || req.body.userId;
            
            if (req.user.role === UserRole.ADMIN || req.user.userId === resourceUserId) {
                next();
            } else {
                throw new AppError('Chỉ có thể truy cập tài nguyên của chính mình', 403);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default  TokenMiddleware;
