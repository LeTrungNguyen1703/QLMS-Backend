import {Router} from "express";
import {addSach, updateSach, getSach, deleteSach, getallSach} from "../Controllers/SachController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";
import upload from "../Middleware/Multer";

const routerSach = Router();

// Route công khai - Không cần đăng nhập để xem sách
routerSach.get("/search-sach", getallSach);

routerSach.get("/get-sach/:id", getSach);

// Route cần xác thực
routerSach.post("/add-sach",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    upload.single('HinhAnh'),
    addSach);
routerSach.put("/update-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    upload.single('HinhAnh'),
    updateSach);
routerSach.delete("/delete-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    deleteSach);
routerSach.get("/get-all-sach",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getallSach);

export default routerSach;
