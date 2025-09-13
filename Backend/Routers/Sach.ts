import { Router } from "express";
import {addSach} from "../Controllers/Sach";
import upload from "../Middleware/Multer";
const routerSach = Router();

routerSach.post("/add-sach", upload.single("hinhanh"), addSach);

export default routerSach;