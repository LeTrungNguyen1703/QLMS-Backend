import express from "express";
import {
    addMuonSach,
    getMuonSach,
    updateMuonSach,
    deleteMuonSach,
    getAllMuonSach,
    getMuonSachByDocGiaId, getMuonSachByMaSachId
} from "../Controllers/TheoDoiMuonSachController";
import {verifyToken} from "../Middleware/Token";
import {TheoDoiMuonSachRequest} from "../DTO/Request/TheoDoiMuonSachRequest";

const router = express.Router();

// Thêm thông tin mượn sách mới
router.post("/add-muonsach", addMuonSach);

// Lấy thông tin mượn sách theo ID
router.get("/get-muonsach/:id", getMuonSach);

// Cập nhật thông tin mượn sách
router.put("/update-muonsach/:id", updateMuonSach);

// Xóa thông tin mượn sách
router.delete("/delete-muonsach/:id", deleteMuonSach);

// Lấy tất cả thông tin mượn sách
router.get("/get-all-muonsach", getAllMuonSach);

// Lấy thông tin mượn sách theo độc giả
router.get("/get-by-docgia/:docgiaId", getMuonSachByDocGiaId);

router.get("/get-by/:sachId", getMuonSachByMaSachId);

export default router;
