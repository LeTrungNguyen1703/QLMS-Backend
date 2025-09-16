// filepath: c:\Users\Lenovo\WebstormProjects\QLMS\Backend\Controllers\NhaXuatBanController.ts
import {Request, Response, NextFunction} from "express";
import NhaXuatBanService from "../Services/NhaXuatBanService";
import {plainToInstance} from "class-transformer";
import {APIResponse} from "../DTO/Response/APIResponse";
import {catchAsync} from "../Middleware/ErrorHandler";
import {INhaXuatBanRequestExtended, NhaXuatBanRequest} from "../DTO/Request/NhaXuatBanRequest";
import {NhaXuatBanResponse} from "../DTO/Response/NhaXuatBanResponse";

// Thêm nhà xuất bản
export const addNXB = catchAsync(async (req: INhaXuatBanRequestExtended, res: Response<APIResponse<NhaXuatBanResponse>>) => {
    const nxbData = req.body;
    const dto = plainToInstance(NhaXuatBanRequest, nxbData);

    const nhaXuatBan = await NhaXuatBanService.createNhaXuatBan(dto);

    return res.status(201).json({
        message: "Thêm nhà xuất bản thành công",
        data: nhaXuatBan
    });
});

// Update nhà xuất bản
export const updateNXB = catchAsync(async (req: INhaXuatBanRequestExtended, res: Response) => {
    const nxbData = req.body;
    const dto = plainToInstance(NhaXuatBanRequest, nxbData);
    await NhaXuatBanService.updateNhaXuatBan(req.params.id, dto);
    return res.status(200).json({
        message: "Cập nhật nhà xuất bản thành công"
    });
});

export const getNhaXuatBanById = catchAsync(async (req: Request, res: Response<APIResponse<NhaXuatBanResponse>>) => {
    const nhaXuatBan = await NhaXuatBanService.getNhaXuatBanById(req.params.id);
    return res.status(200).json({
        message: "Lấy thông tin nhà xuất bản thành công",
        data: nhaXuatBan
    });
});

// Lấy nhà xuất bản dựa theo custom id
export const getNhaXuatBanByCustomId = catchAsync(async (req: Request, res: Response<APIResponse<NhaXuatBanResponse>>) => {
    const nhaXuatBan = await NhaXuatBanService.getNhaXuatBanByCustomId(req.params.id);
    return res.status(200).json({
        message: "Lấy thông tin nhà xuất bản thành công",
        data: nhaXuatBan
    });
});

// Xóa nhà xuất bản dựa theo id
export const deleteNXB = catchAsync(async (req: Request, res: Response) => {
    await NhaXuatBanService.deleteNhaXuatBanById(req.params.id);
    return res.status(200).json({
        message: "Xóa nhà xuất bản thành công"
    });
});

export const getAllNXB = catchAsync(async (req: Request, res: Response<APIResponse<NhaXuatBanResponse[]>>) => {
    const nhaXuatBans = await NhaXuatBanService.getAllNhaXuatBan();

    return res.status(200).json({
        message: "Lấy tất cả nhà xuất bản thành công",
        data: nhaXuatBans
    });
});
