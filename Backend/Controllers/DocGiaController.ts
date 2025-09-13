import { Request, Response } from "express";
import DocGiaService from "../Services/DocGiaService";

// Thêm đọc giả
export const addDG = async (req: Request, res: Response) => {
  try {
    const docGia = await DocGiaService.createDocGia(req.body);
    return res.status(200).json({
      message: "Thêm đọc giả thành công",
      data: docGia,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

// Update đọc giả
export const updateDG = async (req: Request, res: Response) => {
  try {
    await DocGiaService.updateDocGia(req.params.id, req.body);
    return res.status(200).json({ message: "Cập nhật đọc giả thành công" });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

// Lấy người dùng dựa theo id
export const getDG = async (req: Request, res: Response) => {
  try {
    const docGia = await DocGiaService.getDocGiaById(req.params.id);
    return res.status(200).json({
      message: "Lấy thông tin đọc giả thành công",
      data: docGia,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

// Xóa đọc giả dựa theo id
export const deleteDG = async (req: Request, res: Response) => {
  try {
    const docGia = await DocGiaService.deleteDocGia(req.params.id);
    return res.status(200).json({
      message: "Xóa đọc giả thành công",
      data: docGia,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getallDG = async (req: Request, res: Response) => {
  try {
    const docgia = await DocGiaService.getAllDocGia();
    return res.status(200).json({
      message: "Lấy tất cả đọc giả thành công",
      data: docgia,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};