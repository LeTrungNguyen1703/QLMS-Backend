import {Router} from "express";
import {addSach, updateSach, getSach, deleteSach, getallSach} from "../Controllers/SachController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const routerSach = Router();

// Route công khai - Đọc giả có thể tìm sách
routerSach.get("/search-sach",
    TokenMiddleware.authenticate,
    getallSach);

routerSach.get("/get-sach/:id",
    TokenMiddleware.authenticate,
    getSach);

routerSach.post("/add-sach",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    addSach);
routerSach.put("/update-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
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
