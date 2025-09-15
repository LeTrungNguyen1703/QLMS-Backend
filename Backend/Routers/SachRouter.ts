import { Router } from "express";
import {addSach, getAllSach, getSach, updateSach, deleteSach} from "../Controllers/SachController";
import upload from "../Middleware/Multer";
const routerSach = Router();

// Thêm sách mới
routerSach.post("/add-sach", upload.single("hinhanh"), addSach);

// Lấy danh sách tất cả sách
routerSach.get("/get-all-sach", getAllSach);

// Lấy thông tin một cuốn sách theo mã
routerSach.get("/get-sach/:id", getSach);

// Cập nhật thông tin sách
routerSach.put("/update-sach/:id", upload.single("hinhanh"), updateSach);

// Xóa sách
routerSach.delete("/delete-sach/:id", deleteSach);

export default routerSach;