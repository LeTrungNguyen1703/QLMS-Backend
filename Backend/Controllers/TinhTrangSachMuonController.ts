import { Request, Response } from "express";
import TinhTrangSachMuonService from "../Services/TinhTrangSachMuonService";
import { APIResponse } from "../DTO/Response/APIResponse";
import { catchAsync } from "../Middleware/ErrorHandler";

// Xác nhận cho mượn sách (chuyển từ CHO_DUYET -> DA_DUYET)
export const xacNhanChoMuonSach = catchAsync(async (req: Request, res: Response<APIResponse<void>>) => {
    const { id } = req.params;

    await TinhTrangSachMuonService.xacNhanChoMuonSach(id);

    return res.status(200).json({
        message: "Xác nhận cho mượn sách thành công",
    });
});

// Xác nhận đã trả sách (chuyển từ DA_DUYET -> DA_TRA)
export const xacNhanDaTraSach = catchAsync(async (req: Request, res: Response<APIResponse<void>>) => {
    const { id } = req.params;

    await TinhTrangSachMuonService.xacNhanDaTraSach(id);

    return res.status(200).json({
        message: "Xác nhận đã trả sách thành công",
    });
});

// Phạt mượn sách quá hạn
export const phatMuonSachQuaHan = catchAsync(async (req: Request, res: Response<APIResponse<void>>) => {
    const { id } = req.params;
    const { soTienPhat } = req.body;

    if (!soTienPhat || soTienPhat <= 0) {
        return res.status(400).json({
            message: "Số tiền phạt phải lớn hơn 0",
        });
    }

    await TinhTrangSachMuonService.phatMuonSachQuaHan(id, soTienPhat);

    return res.status(200).json({
        message: "Phạt mượn sách quá hạn thành công",
    });
});

// Từ chối cho mượn sách
export const tuChoiChoMuonSach = catchAsync(async (req: Request, res: Response<APIResponse<void>>) => {
    const { id } = req.params;
    const { lyDo } = req.body;

    await TinhTrangSachMuonService.tuChoiChoMuonSach(id, lyDo);

    return res.status(200).json({
        message: "Từ chối cho mượn sách thành công",
    });
});

// Lấy danh sách sách chờ duyệt
export const getDanhSachSachChoDuyet = catchAsync(async (req: Request, res: Response<APIResponse<any>>) => {
    const danhSach = await TinhTrangSachMuonService.getDanhSachTheoTrangThai("CHO_DUYET");

    return res.status(200).json({
        message: "Lấy danh sách sách chờ duyệt thành công",
        data: danhSach,
    });
});

// Lấy danh sách sách đã duyệt (đang mượn)
export const getDanhSachSachDaDuyet = catchAsync(async (req: Request, res: Response<APIResponse<any>>) => {
    const danhSach = await TinhTrangSachMuonService.getDanhSachTheoTrangThai("DA_DUYET");

    return res.status(200).json({
        message: "Lấy danh sách sách đã duyệt thành công",
        data: danhSach,
    });
});

// Lấy danh sách sách đã trả
export const getDanhSachSachDaTra = catchAsync(async (req: Request, res: Response<APIResponse<any>>) => {
    const danhSach = await TinhTrangSachMuonService.getDanhSachTheoTrangThai("DA_TRA");

    return res.status(200).json({
        message: "Lấy danh sách sách đã trả thành công",
        data: danhSach,
    });
});

// Lấy danh sách sách quá hạn
export const getDanhSachSachQuaHan = catchAsync(async (req: Request, res: Response<APIResponse<any>>) => {
    const danhSach = await TinhTrangSachMuonService.getDanhSachSachQuaHan();

    return res.status(200).json({
        message: "Lấy danh sách sách quá hạn thành công",
        data: danhSach,
    });
});

