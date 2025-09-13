import {Router} from "express";
import {Register, Login, UpdateInfoNV, changePassword, getNV, deleteNV } from "../Controllers/Nhanvien";
const routernv = Router();

routernv.get("/get-nv/:id", getNV);
routernv.post("/register", Register);
routernv.post("/login", Login);
routernv.put("/update-nv/:id", UpdateInfoNV);
routernv.put("/changpassword-nv/:id", changePassword);
routernv.delete("/delete-nv/:id", deleteNV);

export default routernv;