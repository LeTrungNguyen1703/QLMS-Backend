import { Router } from "express";
import {addDG, updateDG, getDocGiaByCustomId, deleteDG, getallDG, getDocGiaById} from "../Controllers/DocGiaController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const routerDocGia = Router();

// Route công khai - không cần xác thực
routerDocGia.post("/add-dg", addDG);

// Routes cần xác thực - chỉ Admin hoặc Nhân viên mới được truy cập
routerDocGia.get("/get-all-dg", 
    TokenMiddleware.authenticate, 
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN), 
    getallDG
);

routerDocGia.get("/get-dg-by-custom-id/:id", 
    TokenMiddleware.authenticate, 
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN), 
    getDocGiaByCustomId
);

routerDocGia.get("/get-dg/:id", 
    TokenMiddleware.authenticate, 
    TokenMiddleware.authorizeOwner, // Chỉ Admin hoặc chính user đó mới xem được
    getDocGiaById
);

routerDocGia.put("/update-dg/:id", 
    TokenMiddleware.authenticate, 
    TokenMiddleware.authorizeOwner, // Chỉ Admin hoặc chính user đó mới sửa được
    updateDG
);

routerDocGia.delete("/delete-dg/:id", 
    TokenMiddleware.authenticate, 
    TokenMiddleware.authorize('Admin'), // Chỉ Admin mới được xóa
    deleteDG
);

export default routerDocGia;