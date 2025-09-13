import { Request, Response } from "express";
import NhanVienService from "../Services/NhanVienService";

export const Register = async (req: Request, res: Response) => {
  try {
    const nhanVien = await NhanVienService.register(req.body);
    return res.status(200).json({
      message: "Đăng ký thành công",
      data: nhanVien,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { SoDienThoai, MatKhau } = req.body;
    const result = await NhanVienService.login(SoDienThoai, MatKhau);

    // Thiết lập cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 20 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: result.message,
      id: result.id,
      token: result.token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const UpdateInfoNV = async (req: Request, res: Response) => {
  try {
    await NhanVienService.updateInfo(req.params.id, req.body);
    return res.status(200).json({
      message: "Cập nhật thông tin nhân viên thành công",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { MatKhau, NhapMatKhauMoi, NhapLaiMatKhauMoi } = req.body;
    await NhanVienService.changePassword(
      req.params.id,
      MatKhau,
      NhapMatKhauMoi,
      NhapLaiMatKhauMoi
    );
    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getNV = async (req: Request, res: Response) => {
  try {
    const nhanVien = await NhanVienService.getNhanVienById(req.params.id);
    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: nhanVien,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const deleteNV = async (req: Request, res: Response) => {
  try {
    await NhanVienService.deleteNhanVien(req.params.id);
    return res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};

export const getAllNV = async (req: Request, res: Response) => {
  try {
    const nhanViens = await NhanVienService.getAllNhanVien();
    return res.status(200).json({
      message: "Lấy tất cả nhân viên thành công",
      data: nhanViens,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Lỗi Server" });
  }
};
