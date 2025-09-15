import {Router} from "express";
import {Register, Login, UpdateInfoNV, changePassword, getNV, deleteNV,getAllNV } from "../Controllers/NhanVienController";
const routerNhanVien = Router();

routerNhanVien.get("/get-nv/:id", getNV);
routerNhanVien.post("/register", Register);
routerNhanVien.post("/login", Login);
routerNhanVien.put("/update-nv/:id", UpdateInfoNV);
routerNhanVien.put("/changpassword-nv/:id", changePassword);
routerNhanVien.delete("/delete-nv/:id", deleteNV);
routerNhanVien.get("/get-all-nv", getAllNV);

export default routerNhanVien;