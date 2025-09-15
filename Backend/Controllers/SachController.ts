import {Request, Response, NextFunction} from "express";
import SachService from "../Services/SachService";
import {SachRequest, ISachRequestExtended} from "../DTO/Request/SachRequest";
import {ISachResponse} from "../DTO/Response/ISachResponse";
import {plainToClass} from "class-transformer";
import {APIResponse, APIResponseError} from "../DTO/Response/APIResponse";
import {catchAsync, AppError} from "../Middleware/ErrorHandler";

// Thêm sách
export const addSach = catchAsync(async (req: ISachRequestExtended, res: Response<APIResponse<ISachResponse>>) => {
    const sachData = req.body;
    const dto = plainToClass(SachRequest, sachData);

    const sach = await SachService.createSach(dto);

    return res.status(201).json(new APIResponse(sach));
});

// Update sách
export const updateSach = catchAsync(async (req: ISachRequestExtended, res: Response) => {
    const sachData = req.body;
    const dto = plainToClass(SachRequest, sachData);
    const sach = await SachService.updateSach(req.params.id, dto);

    if (!sach) {
        throw new AppError("Không tìm thấy sách", 404);
    }
    return res.status(200).json(new APIResponse({
        message: "Cập nhật sách thành công",
    }));
});

// Lấy sách dựa theo id
export const getSach = catchAsync(async (req: Request, res: Response<APIResponse<ISachResponse>>) => {
    const sach = await SachService.getSachById(req.params.id);

    return res.status(200).json(new APIResponse({
        message: "Lấy thông tin sách thành công",
        data: sach
    }));
});

// Xóa sách dựa theo id
export const deleteSach = catchAsync(async (req: Request, res: Response) => {
    const sach = await SachService.deleteSach(req.params.id);
    return res.status(200).json(new APIResponse({
        message: "Xóa sách thành công",
    }));
});

export const getallSach = catchAsync(async (req: Request, res: Response<APIResponse<ISachResponse[]>>) => {
    const sachs = await SachService.getAllSach();

    return res.status(200).json(new APIResponse({
        message: "Lấy tất cả sách thành công",
        data: sachs
    }));
});
