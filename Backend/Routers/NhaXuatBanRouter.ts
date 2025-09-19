// filepath: c:\Users\Lenovo\WebstormProjects\QLMS\Backend\Routers\NhaXuatBanRouter.ts
import {Router} from "express";
import {
    addNXB,
    updateNXB,
    getNhaXuatBanByCustomId,
    deleteNXB,
    getAllNXB,
    getNhaXuatBanById
} from "../Controllers/NhaXuatBanController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const routerNhaXuatBan = Router();

routerNhaXuatBan.get("/get-nxb-by-custom-id/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getNhaXuatBanByCustomId);
routerNhaXuatBan.get("/get-nxb/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getNhaXuatBanById);
routerNhaXuatBan.post("/add-nxb",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    addNXB);
routerNhaXuatBan.put("/update-nxb/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    updateNXB);
routerNhaXuatBan.delete("/delete-nxb/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    deleteNXB);
routerNhaXuatBan.get("/get-all-nxb",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getAllNXB);

export default routerNhaXuatBan;
