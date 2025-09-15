import {Request, Response, NextFunction} from "express";
import DocGiaService from "../Services/DocGiaService";
import {DocGiaRequest, IDocGiaRequestExtended} from "../DTO/Request/DocGiaRequest";
import {IDocGiaResponse} from "../DTO/Response/IDocGiaResponse";
import {plainToClass} from "class-transformer";
import {APIResponse, APIResponseError} from "../DTO/Response/APIResponse";
import {catchAsync, AppError} from "../Middleware/ErrorHandler";

// Thêm đọc giả
export const addDG = catchAsync(async (req: IDocGiaRequestExtended, res: Response<APIResponse<IDocGiaResponse>>) => {
    const plantData = req.body;
    const dto = plainToClass(DocGiaRequest, plantData);

    const docGia = await DocGiaService.createDocGia(dto);

    return res.status(201).json(new APIResponse(docGia));
});

// Update đọc giả
export const updateDG = catchAsync(async (req: IDocGiaRequestExtended, res: Response) => {
    const plantData = req.body;
    const dto = plainToClass(DocGiaRequest, plantData);
    const docGia = await DocGiaService.updateDocGia(req.params.id, dto);

    if (!docGia) {
        throw new AppError("Không tìm thấy đọc giả", 404);
    }
    return res.status(200).json(new APIResponse({
        message: "Cập nhật đọc giả thành công",
    }));
});

// Lấy người dùng dựa theo id
export const getDG = catchAsync(async (req: Request, res: Response<APIResponse<IDocGiaResponse>>) => {
    const docGia = await DocGiaService.getDocGiaById(req.params.id);

    return res.status(200).json(new APIResponse({
        message: "Lấy thông tin đọc giả thành công",
        data: docGia
    }));
});

// Xóa đọc giả dựa theo id
export const deleteDG = catchAsync(async (req: Request, res: Response) => {
    const docGia = await DocGiaService.deleteDocGia(req.params.id);
    return res.status(200).json(new APIResponse({
        message: "Xóa đọc giả thành công",
    }));
});

export const getallDG = catchAsync(async (req: Request, res: Response<APIResponse<IDocGiaResponse[]>>) => {
    const docGias = await DocGiaService.getAllDocGia();

    return res.status(200).json(new APIResponse({
        message: "Lấy tất cả đọc giả thành công",
        data: docGias
    }));
});
