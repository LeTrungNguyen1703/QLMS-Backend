import express from "express";
import {
    addMuonSach,
    getMuonSach,
    updateMuonSach,
    deleteMuonSach,
    getAllMuonSach,
    getMuonSachByDocGiaId, getMuonSachByMaSachId
} from "../Controllers/TheoDoiMuonSachController";
import TokenMiddleware from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const router = express.Router();

// Thêm thông tin mượn sách mới
router.post("/add-muonsach",
    TokenMiddleware.authenticate
    , addMuonSach);

// Lấy thông tin mượn sách theo ID
router.get("/get-muonsach/:id", 
    TokenMiddleware.authenticate
    ,getMuonSach);

// Cập nhật thông tin mượn sách
router.put("/update-muonsach/:id", 
    TokenMiddleware.authenticate
    ,updateMuonSach);

// Xóa thông tin mượn sách
router.delete("/delete-muonsach/:id", 
    TokenMiddleware.authenticate
    ,deleteMuonSach);

// Lấy tất cả thông tin mượn sách
router.get("/get-all-muonsach",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getAllMuonSach);

// Lấy thông tin mượn sách theo độc giả
router.get("/get-by-docgia/:docgiaId", 
    TokenMiddleware.authenticate,
    TokenMiddleware.authorizeOwner
    ,getMuonSachByDocGiaId);

router.get("/get-by/:sachId",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    getMuonSachByMaSachId);

export default router;
