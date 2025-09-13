import { Request, Response } from "express";
import multer from "multer";
import Sach from "../Models/SACH";

export const addSach = async (req: Request, res: Response) => {
  try {
    const { tensach, dongia, soquyen, namxuatban, idnxb, tacgia } = req.body;
    let hinhanh = req.file ? req.file.path : "";
    if (!req.body?.tensach) {
      return res.status(400).json({ message: "Vui lòng nhập tên sách" });
    } else if (!req.body?.dongia) {
      return res.status(400).json({ message: "Vui lòng nhập đơn giá sách" });
    } else if (!req.body?.soquyen) {
      return res.status(400).json({ message: "Vui lòng nhập số lượng sách" });
    } else if (!req.body?.namxuatban) {
      return res.status(400).json({ message: "Vui lòng chọn năm xuất bản sách" });
    } else if (!req.body?.idnxb) {
      return res.status(400).json({ message: "Vui lòng chọn nhà xuất bản sách" });
    }else if(!req.body?.tacgia){
      return res.status(400).json({ message: "Vui lòng chọn tác giả sách" });  
    }

    const sach = new Sach({
      hinhanh,
      tensach,
      dongia,
      soquyen,
      namxuatban,
      idnxb,
      tacgia,
    });

    await sach.save();

    if (!sach) {
      return res
        .status(400)
        .json({ message: "Thêm sách mới không thành công" });
    }

    return res
      .status(200)
      .json({ message: "Thêm sách mới thành công", data: sach });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Lỗi Server"});
  }
};
