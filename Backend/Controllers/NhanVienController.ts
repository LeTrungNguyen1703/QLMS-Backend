import {Request, Response, NextFunction} from "express";
import NhanVienService from "../Services/NhanVienService";
import {NhanVienRequest, INhanVienRequestExtended} from "../DTO/Request/NhanVienRequest";
import {NhanVienResponse} from "../DTO/Response/NhanVienResponse";
import {plainToInstance} from "class-transformer";
import {APIResponse} from "../DTO/Response/APIResponse";
import {catchAsync} from "../Middleware/ErrorHandler";

// Thêm nhân viên
export const addNV = catchAsync(async (req: INhanVienRequestExtended, res: Response<APIResponse<NhanVienResponse>>) => {
    const nhanVienData = req.body;
    const dto = plainToInstance(NhanVienRequest, nhanVienData);

    const nhanVien = await NhanVienService.createNhanVien(dto);

    return res.status(201).json({
        message: "Thêm nhân viên thành công",
        data: nhanVien
    });
});

// Update nhân viên
export const updateNV = catchAsync(async (req: INhanVienRequestExtended, res: Response) => {
    const nhanVienData = req.body;
    const dto = plainToInstance(NhanVienRequest, nhanVienData);
    await NhanVienService.updateNhanVien(req.params.id, dto);
    return res.status(200).json({
        message: "Cập nhật nhân viên thành công"
    });
});

// Lấy nhân viên dựa theo id
export const getNV = catchAsync(async (req: Request, res: Response<APIResponse<NhanVienResponse>>) => {
    const nhanVien = await NhanVienService.getNhanVienById(req.params.id);
    return res.status(200).json({
        message: "Lấy thông tin nhân viên thành công",
        data: nhanVien
    });
});

// Xóa nhân viên dựa theo id
export const deleteNV = catchAsync(async (req: Request, res: Response) => {
    await NhanVienService.deleteNhanVien(req.params.id);
    return res.status(200).json({
        message: "Xóa nhân viên thành công"
    });
});

export const getallNV = catchAsync(async (req: Request, res: Response<APIResponse<NhanVienResponse[]>>) => {
    const nhanViens = await NhanVienService.getAllNhanVien();
    return res.status(200).json({
        message: "Lấy tất cả nhân viên thành công",
        data: nhanViens
    });
});
