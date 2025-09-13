import {Router} from "express";
import {Register, Login, UpdateInfoNV, changePassword, getNV, deleteNV } from "../Controllers/NhanVien";
const routerNhanVien = Router();

routerNhanVien.get("/get-nv/:id", getNV);
routerNhanVien.post("/register", Register);
routerNhanVien.post("/login", Login);
routerNhanVien.put("/update-nv/:id", UpdateInfoNV);
routerNhanVien.put("/changpassword-nv/:id", changePassword);
routerNhanVien.delete("/delete-nv/:id", deleteNV);

export default routerNhanVien;