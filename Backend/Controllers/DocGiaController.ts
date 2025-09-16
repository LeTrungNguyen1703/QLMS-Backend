import {Request, Response, NextFunction} from "express";
import DocGiaService from "../Services/DocGiaService";
import {DocGiaRequest, IDocGiaRequestExtended} from "../DTO/Request/DocGiaRequest";
import {DocGiaResponse} from "../DTO/Response/DocGiaResponse";
import {plainToInstance} from "class-transformer";
import {APIResponse, APIResponseError} from "../DTO/Response/APIResponse";
import {catchAsync, AppError} from "../Middleware/ErrorHandler";

// Thêm đọc giả
export const addDG = catchAsync(async (req: IDocGiaRequestExtended, res: Response<APIResponse<DocGiaResponse>>) => {
    const plantData = req.body;
    const dto = plainToInstance(DocGiaRequest, plantData);

    const docGia = await DocGiaService.createDocGia(dto);

    return res.status(201).json({
        message: "Thêm đọc giả thành công",
        data: docGia
    });
});

// Update đọc giả
export const updateDG = catchAsync(async (req: IDocGiaRequestExtended, res: Response) => {
    const plantData = req.body;
    const dto = plainToInstance(DocGiaRequest, plantData);
    const docGia = await DocGiaService.updateDocGia(req.params.id, dto);
    return res.status(200).json({
        message: "Cập nhật đọc giả thành công"
    });
});

export const getDocGiaById = catchAsync(async (req: Request, res: Response<APIResponse<DocGiaResponse>>) => {
    const docGia = await DocGiaService.getDocGiaById(req.params.id);
    return res.status(200).json({
        message: "Lấy thông tin đọc giả thành công",
        data: docGia
    });
});

// Lấy người dùng dựa theo id
export const getDocGiaByCustomId = catchAsync(async (req: Request, res: Response<APIResponse<DocGiaResponse>>) => {
    const docGia = await DocGiaService.getDocGiaByCustomId(req.params.id);
    return res.status(200).json({
        message: "Lấy thông tin đọc giả thành công",
        data: docGia
    });
});

// Xóa đọc giả dựa theo id
export const deleteDG = catchAsync(async (req: Request, res: Response) => {
    await DocGiaService.deleteDocGiaById(req.params.id);
    return res.status(200).json({
        message: "Xóa đọc giả thành công"
    });
});

export const getallDG = catchAsync(async (req: Request, res: Response<APIResponse<DocGiaResponse[]>>) => {
    const docGias = await DocGiaService.getAllDocGia();

    return res.status(200).json({
        message: "Lấy tất cả đọc giả thành công",
        data: docGias
    });
});
