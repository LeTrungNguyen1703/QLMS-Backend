import {Router} from "express";
import * as TinhTrangSachMuonController from "../Controllers/TinhTrangSachMuonController";
import {TokenMiddleware} from "../Middleware/Token";
import {UserRole} from "../Enums/UserRole";

const router = Router();

// Xác nhận cho mượn sách (CHO_DUYET -> DA_DUYET)
router.put(
    "/xac-nhan-cho-muon-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.xacNhanChoMuonSach
);

// Xác nhận đã trả sách (DA_DUYET -> DA_TRA)
router.put(
    "/xac-nhan-da-tra-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.xacNhanDaTraSach
);

// Phạt mượn sách quá hạn
router.put(
    "/phat-muon-sach-qua-han/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.phatMuonSachQuaHan
);

// Từ chối cho mượn sách
router.delete(
    "/tu-choi-cho-muon-sach/:id",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.tuChoiChoMuonSach
);

// Lấy danh sách sách chờ duyệt
router.get(
    "/danh-sach-cho-duyet",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.getDanhSachSachChoDuyet
);

// Lấy danh sách sách đã duyệt (đang mượn)
router.get(
    "/danh-sach-da-duyet",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.getDanhSachSachDaDuyet
);

// Lấy danh sách sách đã trả
router.get(
    "/danh-sach-da-tra",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.getDanhSachSachDaTra
);

// Lấy danh sách sách quá hạn
router.get(
    "/danh-sach-qua-han",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN, UserRole.NHAN_VIEN),
    TinhTrangSachMuonController.getDanhSachSachQuaHan
);

export default router;
