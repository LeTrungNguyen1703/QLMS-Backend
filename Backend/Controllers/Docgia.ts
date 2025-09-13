import { Request, Response } from "express";
import DocGia from "../Models/Docgia";
//Thêm đọc giả
export const addDG = async (req: Request, res: Response) => {
  try {
    const { holot, ten, ngaysinh, phai, diachi, sodienthoai } = req.body;
    if (!req.body?.holot) {
      return res.status(400).json({ message: "Vui lòng nhập họ lót" });
    } else if (!req.body?.ten) {
      return res.status(400).json({ message: "Vui lòng nhập tên" });
    } else if (!req.body?.ngaysinh) {
      return res.status(400).json({ message: "Vui lòng chọn ngày sinh" });
    } else if (!req.body?.phai) {
      return res.status(400).json({ message: "Vui lòng chọn giới tính" });
    } else if (!req.body?.diachi) {
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ" });
    } else if (!req.body?.sodienthoai) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
    }

    const checksdt = await DocGia.findOne({ sodienthoai });
    if (checksdt) {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }

    const docgia = new DocGia({
      holot,
      ten,
      ngaysinh,
      phai,
      diachi,
      sodienthoai,
    });
    await docgia.save();

    if (!docgia) {
      return res.status(400).json({ message: "Thêm đọc giả không thành công" });
    }

    return res.status(200).json({
      message: "Thêm đọc giả thành công",
      data: docgia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};
//Update đọc giả
export const updateDG = async (req: Request, res: Response) => {
  try {
    const { holot, ten, ngaysinh, phai, diachi, sodienthoai } = req.body;
    const update = await DocGia.findByIdAndUpdate(
      req.params.id,
      {
        holot,
        ten,
        ngaysinh,
        phai,
        diachi,
        sodienthoai,
      },
      { new: true }
    );
    if (!update) {
      return res
        .status(400)
        .json({ message: "Cập nhật đọc giả không thành công" });
    }

    return res.status(200).json({ message: "Cập nhật đọc giả thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};
//Lấy người dùng dựa theo id
export const getDG = async (req: Request, res: Response) => {
  try {
    const docgia = await DocGia.findById(req.params.id);
    if (!docgia) {
      return res
        .status(400)
        .json({ message: "Lấy thông tin đọc giả không thành công" });
    }
    return res.status(200).json({
      message: "Lấy thông tin đọc giả thành công",
      data: docgia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};
//Xóa đọc giả dựa theo id
export const deleteDG = async (req: Request, res: Response) => {
  try {
    const docgia = await DocGia.findByIdAndDelete(req.params.id);
    if (!docgia) {
      return res.status(400).json({ message: "Xóa đọc giả không thành công" });
    }
    return res.status(200).json({
      message: "Xóa đọc giả thành công",
      data: docgia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};
