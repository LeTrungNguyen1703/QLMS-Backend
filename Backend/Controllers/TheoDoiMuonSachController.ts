import { Request, Response } from "express";
import TheoDoiMuonSachService from "../Services/TheoDoiMuonSachService";

export const addMuonSach = async (req: Request, res: Response) => {
  try {
    const muonSach = await TheoDoiMuonSachService.createMuonSach(req.body);
    return res.status(200).json({
      message: "Thêm thông tin mượn sách thành công",
      data: muonSach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const updateMuonSach = async (req: Request, res: Response) => {
  try {
    const muonSach = await TheoDoiMuonSachService.updateMuonSach(req.params.id, req.body);
    return res.status(200).json({
      message: "Cập nhật thông tin mượn sách thành công",
      data: muonSach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getMuonSach = async (req: Request, res: Response) => {
  try {
    const muonSach = await TheoDoiMuonSachService.getMuonSachById(req.params.id);
    return res.status(200).json({
      message: "Lấy thông tin mượn sách thành công",
      data: muonSach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const deleteMuonSach = async (req: Request, res: Response) => {
  try {
    const muonSach = await TheoDoiMuonSachService.deleteMuonSach(req.params.id);
    return res.status(200).json({
      message: "Xóa thông tin mượn sách thành công",
      data: muonSach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getAllMuonSach = async (req: Request, res: Response) => {
  try {
    const muonSachs = await TheoDoiMuonSachService.getAllMuonSach();
    return res.status(200).json({
      message: "Lấy tất cả thông tin mượn sách thành công",
      data: muonSachs,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getMuonSachByDocGiaId = async (req: Request, res: Response) => {
  try {
    const muonSachs = await TheoDoiMuonSachService.getMuonSachByDocGiaId(req.params.docgiaId);
    return res.status(200).json({
      message: "Lấy thông tin mượn sách theo độc giả thành công",
      data: muonSachs,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};
