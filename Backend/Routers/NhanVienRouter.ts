import { Router } from "express";
import {addNV, updateNV, getNV, deleteNV, getallNV} from "../Controllers/NhanVienController";
const routerNhanVien = Router();

routerNhanVien.get("/get-nv/:id", getNV);
routerNhanVien.post("/add-nv", addNV);
routerNhanVien.put("/update-nv/:id", updateNV);
routerNhanVien.delete("/delete-nv/:id", deleteNV);
routerNhanVien.get("/get-all-nv", getallNV);

export default routerNhanVien;
