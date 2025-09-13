import { Request, Response } from "express";
import SachService from "../Services/SachService";

export const addSach = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin hình ảnh từ file upload (nếu có)
    let sachData = req.body;
    if (req.file) {
      sachData.HinhAnh = req.file.path;
    }
    
    const sach = await SachService.createSach(sachData);
    return res.status(200).json({ 
      message: "Thêm sách mới thành công", 
      data: sach 
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const updateSach = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin hình ảnh từ file upload (nếu có)
    let sachData = req.body;
    if (req.file) {
      sachData.HinhAnh = req.file.path;
    }
    
    const sach = await SachService.updateSach(req.params.id, sachData);
    return res.status(200).json({ 
      message: "Cập nhật sách thành công", 
      data: sach 
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getSach = async (req: Request, res: Response) => {
  try {
    const sach = await SachService.getSachById(req.params.id);
    return res.status(200).json({
      message: "Lấy thông tin sách thành công",
      data: sach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const deleteSach = async (req: Request, res: Response) => {
  try {
    const sach = await SachService.deleteSach(req.params.id);
    return res.status(200).json({
      message: "Xóa sách thành công",
      data: sach,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getAllSach = async (req: Request, res: Response) => {
  try {
    const sachs = await SachService.getAllSach();
    return res.status(200).json({
      message: "Lấy tất cả sách thành công",
      data: sachs,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};
