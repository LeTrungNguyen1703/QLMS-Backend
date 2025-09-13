import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import NhanVien from "../Models/Nhanvien";

export const Register = async (req: Request, res: Response) => {
  try {
    const { hotennv, matkhau, diachi, sodienthoai, chucvu, ngaytao } = req.body;
    if (!req.body?.sodienthoai) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
    } else if (!req.body?.matkhau) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu" });
    }

    const phone = await NhanVien.findOne({ sodienthoai });
    if (phone) {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }

    const hashpass = await bcrypt.hash(matkhau, 10);

    const register = new NhanVien({
      hotennv,
      matkhau: hashpass,
      diachi,
      sodienthoai,
      chucvu,
      ngaytao,
    });
    await register.save();
    if (!register) {
      return res.status(400).json({ message: "Đăng ký không thành công" });
    }

    return res.status(200).json({
      message: "Đăng ký thành công",
      data: register,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { sodienthoai, matkhau } = req.body;
    if (!req.body?.sodienthoai) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
    } else if (!req.body?.matkhau) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu" });
    }

    const phone = await NhanVien.findOne({ sodienthoai });
    if (!phone) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại" });
    }

    const comparepass = await bcrypt.compare(matkhau, phone.matkhau);
    if (!comparepass) {
      return res.status(400).json({ message: "Mật khẩu sai" });
    }

    const token = jwt.sign(
      {
        id: phone._id,
      },
      process.env.KEY_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 20 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      id: phone._id,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};

export const UpdateInfoNV = async (req: Request, res: Response) => {
  try {
    const { hotennv, diachi } = req.body;
    const update = await NhanVien.findByIdAndUpdate(
      req.params.id,
      {
        hotennv: hotennv || "",
        diachi: diachi || "",
      },
      { new: true }
    );
    if (!update) {
      return res
        .status(400)
        .json({ message: "Cập nhật thông tin nhân viên không thành công" });
    }

    return res
      .status(200)
      .json({ message: "Cập nhật thông tin nhân viên thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { matkhau, nhapmatkhaumoi, nhaplaimatkhaumoi } = req.body;
    if (!req.body?.matkhau) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu" });
    } else if (!req.body?.nhapmatkhaumoi) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });
    } else if (!req.body?.nhaplaimatkhaumoi) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập lại mật khẩu mới" });
    } else if (nhaplaimatkhaumoi !== nhapmatkhaumoi) {
      return res.status(400).json({ message: "Mật khẩu mới không trùng nhau" });
    }

    const user = await NhanVien.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const comparepass = await bcrypt.compare(matkhau, user.matkhau);
    if (!comparepass) {
      return res
        .status(400)
        .json({ message: "Mật khẩu cũ tài khoản không chính xác" });
    }

    const hashpass = await bcrypt.hash(nhapmatkhaumoi, 10);
    user.matkhau = hashpass;
    await user.save();
    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
};

export const getNV = async(req: Request, res: Response) => {
  const getInforNV = await NhanVien.findById(req.params.id);

  if(!getInforNV){
    return res
      .status(400)
      .json({ message: "Tài khoản không tồn tại" });
  }

  return res.status(200).json({
    message: "Lấy thông tin người dùng thành công",
    data: getInforNV
  });
}

export const deleteNV = async(req: Request, res: Response) => {
  try {
    const deleteNV = await NhanVien.findByIdAndDelete(req.params.id);
    if(!deleteNV){
      return res.status(400).json({message: "Tài khoản không tồn tại"});
    }
      return res.status(200).json({message: "Xóa tài khoản thành công"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi Server", error });
  }
}