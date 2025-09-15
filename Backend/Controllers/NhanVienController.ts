import {Request, Response, NextFunction} from "express";
import NhanVienService from "../Services/NhanVienService";
import {NhanVienRequest, INhanVienRequestExtended} from "../DTO/Request/NhanVienRequest";
import {INhanVienResponse} from "../DTO/Response/INhanVienResponse";
import {plainToClass} from "class-transformer";
import {APIResponse, APIResponseError} from "../DTO/Response/APIResponse";
import {catchAsync, AppError} from "../Middleware/ErrorHandler";

// Thêm nhân viên
export const addNV = catchAsync(async (req: INhanVienRequestExtended, res: Response<APIResponse<INhanVienResponse>>) => {
    const nhanVienData = req.body;
    const dto = plainToClass(NhanVienRequest, nhanVienData);

    const nhanVien = await NhanVienService.createNhanVien(dto);

    return res.status(201).json(new APIResponse(nhanVien));
});

// Update nhân viên
export const updateNV = catchAsync(async (req: INhanVienRequestExtended, res: Response) => {
    const nhanVienData = req.body;
    const dto = plainToClass(NhanVienRequest, nhanVienData);
    const nhanVien = await NhanVienService.updateNhanVien(req.params.id, dto);

    if (!nhanVien) {
        throw new AppError("Không tìm thấy nhân viên", 404);
    }
    return res.status(200).json(new APIResponse({
        message: "Cập nhật nhân viên thành công",
    }));
});

// Lấy nhân viên dựa theo id
export const getNV = catchAsync(async (req: Request, res: Response<APIResponse<INhanVienResponse>>) => {
    const nhanVien = await NhanVienService.getNhanVienById(req.params.id);

    return res.status(200).json(new APIResponse({
        message: "Lấy thông tin nhân viên thành công",
        data: nhanVien
    }));
});

// Xóa nhân viên dựa theo id
export const deleteNV = catchAsync(async (req: Request, res: Response) => {
    const nhanVien = await NhanVienService.deleteNhanVien(req.params.id);
    return res.status(200).json(new APIResponse({
        message: "Xóa nhân viên thành công",
    }));
});

export const getallNV = catchAsync(async (req: Request, res: Response<APIResponse<INhanVienResponse[]>>) => {
    const nhanViens = await NhanVienService.getAllNhanVien();

    return res.status(200).json(new APIResponse({
        message: "Lấy tất cả nhân viên thành công",
        data: nhanViens
    }));
});
