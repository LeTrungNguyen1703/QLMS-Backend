import {Router} from "express";
import {addNV, updateNV, getNV, deleteNV, getallNV} from "../Controllers/NhanVienController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const routerNhanVien = Router();

// RESTful routes for frontend compatibility
routerNhanVien.get("/",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getallNV);

routerNhanVien.get("/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getNV);

routerNhanVien.post("/",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    addNV);

routerNhanVien.put("/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    updateNV);

routerNhanVien.delete("/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    deleteNV);

// Legacy routes for backward compatibility
routerNhanVien.get("/get-nv/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorizeOwner,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getNV);

routerNhanVien.post("/add-nv",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    addNV);

routerNhanVien.put("/update-nv/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorizeOwner,
    updateNV);

routerNhanVien.delete("/delete-nv/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    deleteNV);

routerNhanVien.get("/get-all-nv",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getallNV);

export default routerNhanVien;
