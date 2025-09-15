import express from "express";
import { addMuonSach, getMuonSach, updateMuonSach, deleteMuonSach, getAllMuonSach, getMuonSachByDocGiaId } from "../Controllers/TheoDoiMuonSachController";
import { verifyToken } from "../Middleware/Token";

const router = express.Router();

// Thêm thông tin mượn sách mới
router.post("/add-muonsach", addMuonSach);

// Lấy thông tin mượn sách theo ID
router.get("/get-muonsach/:id", verifyToken, getMuonSach);

// Cập nhật thông tin mượn sách
router.put("/update-muonsach/:id", verifyToken, updateMuonSach);

// Xóa thông tin mượn sách
router.delete("/delete-muonsach/:id", verifyToken, deleteMuonSach);

// Lấy tất cả thông tin mượn sách
router.get("/get-all-muonsach", verifyToken, getAllMuonSach);

// Lấy thông tin mượn sách theo độc giả
router.get("/get-by-docgia/:docgiaId", verifyToken, getMuonSachByDocGiaId);

export default router;
