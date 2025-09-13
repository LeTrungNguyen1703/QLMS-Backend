import NhanVienRepository from "../Repositories/NhanVienRepository";
import { INhanvien } from "../Models/NHANVIEN";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class NhanVienService {
    async getAllNhanVien() {
        return await NhanVienRepository.findAll();
    }

    async getNhanVienById(id: string) {
        const nhanVien = await NhanVienRepository.findById(id);
        if (!nhanVien) {
            throw new Error("Nhân viên không tồn tại");
        }
        return nhanVien;
    }

    async register(nhanVienData: Partial<INhanvien>) {
        // Kiểm tra dữ liệu đầu vào
        if (!nhanVienData.SoDienThoai) {
            throw new Error("Vui lòng nhập số điện thoại");
        }
        if (!nhanVienData.MatKhau) {
            throw new Error("Vui lòng nhập mật khẩu");
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingNhanVien = await NhanVienRepository.findBySoDienThoai(nhanVienData.SoDienThoai);
        if (existingNhanVien) {
            throw new Error("Số điện thoại đã tồn tại");
        }

        // Mã hóa mật khẩu
        const hashpass = await bcrypt.hash(nhanVienData.MatKhau, 10);

        // Tạo nhân viên mới với mật khẩu đã được mã hóa
        const newNhanVien = {
            ...nhanVienData,
            MatKhau: hashpass
        };

        return await NhanVienRepository.create(newNhanVien);
    }

    async login(SoDienThoai: string, MatKhau: string) {
        // Kiểm tra dữ liệu đầu vào
        if (!SoDienThoai) {
            throw new Error("Vui lòng nhập số điện thoại");
        }
        if (!MatKhau) {
            throw new Error("Vui lòng nhập mật khẩu");
        }

        // Kiểm tra số điện thoại có tồn tại không
        const nhanVien = await NhanVienRepository.findBySoDienThoai(SoDienThoai);
        if (!nhanVien) {
            throw new Error("Số điện thoại không tồn tại");
        }

        // Kiểm tra mật khẩu
        const comparePass = await bcrypt.compare(MatKhau, nhanVien.MatKhau);
        if (!comparePass) {
            throw new Error("Mật khẩu sai");
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: nhanVien._id },
            process.env.KEY_SECRET as string,
            { expiresIn: "1d" }
        );

        return {
            message: "Đăng nhập thành công",
            id: nhanVien._id,
            token
        };
    }

    async updateInfo(id: string, nhanVienData: { HoTenNV?: string, DiaChi?: string }) {
        const existingNhanVien = await NhanVienRepository.findById(id);
        if (!existingNhanVien) {
            throw new Error("Nhân viên không tồn tại");
        }

        return await NhanVienRepository.update(id, {
            HoTenNV: nhanVienData.HoTenNV || "",
            DiaChi: nhanVienData.DiaChi || ""
        });
    }

    async changePassword(id: string, MatKhau: string, NhapMatKhauMoi: string, NhapLaiMatKhauMoi: string) {
        // Kiểm tra dữ liệu đầu vào
        if (!MatKhau) {
            throw new Error("Vui lòng nhập mật khẩu");
        }
        if (!NhapMatKhauMoi) {
            throw new Error("Vui lòng nhập mật khẩu mới");
        }
        if (!NhapLaiMatKhauMoi) {
            throw new Error("Vui lòng nhập lại mật khẩu mới");
        }
        if (NhapMatKhauMoi !== NhapLaiMatKhauMoi) {
            throw new Error("Mật khẩu mới không trùng nhau");
        }

        // Tìm kiếm nhân viên
        const nhanVien = await NhanVienRepository.findById(id);
        if (!nhanVien) {
            throw new Error("Tài khoản không tồn tại");
        }

        // Kiểm tra mật khẩu cũ
        const comparePass = await bcrypt.compare(MatKhau, nhanVien.MatKhau);
        if (!comparePass) {
            throw new Error("Mật khẩu cũ tài khoản không chính xác");
        }

        // Mã hóa mật khẩu mới
        const hashpass = await bcrypt.hash(NhapMatKhauMoi, 10);
        
        // Cập nhật mật khẩu
        nhanVien.MatKhau = hashpass;
        return await nhanVien.save();
    }

    async deleteNhanVien(id: string) {
        const existingNhanVien = await NhanVienRepository.findById(id);
        if (!existingNhanVien) {
            throw new Error("Tài khoản không tồn tại");
        }

        return await NhanVienRepository.delete(id);
    }
}

export default new NhanVienService();
