import { Request, Response } from "express";
import TheoDoiMuonSachService from "../Services/TheoDoiMuonSachService";
import { APIResponse } from "../DTO/Response/APIResponse";
import { catchAsync, AppError } from "../Middleware/ErrorHandler";

export const addMuonSach = catchAsync(async (req: Request, res: Response) => {
  const muonSach = await TheoDoiMuonSachService.createMuonSach(req.body);
  return res.status(200).json({
    message: "Thêm thông tin mượn sách thành công",
    data: muonSach,
  });
});

export const updateMuonSach = catchAsync(async (req: Request, res: Response) => {
  const muonSach = await TheoDoiMuonSachService.updateMuonSach(req.params.id, req.body);
  return res.status(200).json({
    message: "Cập nhật thông tin mượn sách thành công",
    data: muonSach,
  });
});

export const getMuonSach = catchAsync(async (req: Request, res: Response) => {
  const muonSach = await TheoDoiMuonSachService.getMuonSachById(req.params.id);
  
  if (!muonSach) {
    throw new AppError("Không tìm thấy thông tin mượn sách", 404);
  }
  
  return res.status(200).json({
    message: "Lấy thông tin mượn sách thành công",
    data: muonSach,
  });
});

export const deleteMuonSach = catchAsync(async (req: Request, res: Response) => {
  const muonSach = await TheoDoiMuonSachService.deleteMuonSach(req.params.id);
  return res.status(200).json({
    message: "Xóa thông tin mượn sách thành công",
    data: muonSach,
  });
});

export const getAllMuonSach = catchAsync(async (req: Request, res: Response) => {
  const muonSachs = await TheoDoiMuonSachService.getAllMuonSach();
  return res.status(200).json({
    message: "Lấy tất cả thông tin mượn sách thành công",
    data: muonSachs,
  });
});

export const getMuonSachByDocGiaId = catchAsync(async (req: Request, res: Response) => {
  const muonSachs = await TheoDoiMuonSachService.getMuonSachByDocGiaId(req.params.docgiaId);
  return res.status(200).json({
    message: "Lấy thông tin mượn sách theo độc giả thành công",
    data: muonSachs,
  });
});
