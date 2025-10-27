import { Router } from 'express';
import AuthController from '../Controllers/AuthController';
import TokenMiddleware from '../Middleware/Token';
import { LoginRequest } from '../DTO/Request/AuthRequest';

const router = Router();

router.post('/login/docgia', AuthController.loginDocGia);
                              
router.post('/login/nhanvien', AuthController.loginNhanVien);

router.get('/me', TokenMiddleware.authenticate,TokenMiddleware.authorizeOwner, AuthController.getCurrentUser);

export default router;
