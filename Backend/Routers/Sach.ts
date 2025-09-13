import { Router } from "express";
import {addSach} from "../Controllers/Sach";
import upload from "../Middleware/multer";
const routersach = Router();

routersach.post("/add-sach", upload.single("hinhanh"), addSach);

export default routersach;