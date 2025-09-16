import {Request, Response, NextFunction} from "express";
import SachService from "../Services/SachService";
import {SachRequest, ISachRequestExtended} from "../DTO/Request/SachRequest";
import {SachResponse} from "../DTO/Response/SachResponse";
import {plainToInstance} from "class-transformer";
import {APIResponse} from "../DTO/Response/APIResponse";
import {AppError, catchAsync} from "../Middleware/ErrorHandler";

// Thêm sách
export const addSach = catchAsync(async (req: ISachRequestExtended, res: Response<APIResponse<SachResponse>>) => {
    const sachData = req.body;
    const dto = plainToInstance(SachRequest, sachData);

    const sach = await SachService.createSach(dto);

    return res.status(201).json({
        message: "Thêm sách thành công",
        data: sach
    });
});

// Update sách
export const updateSach = catchAsync(async (req: ISachRequestExtended, res: Response) => {
    const sachData = req.body;
    const dto = plainToInstance(SachRequest, sachData);
    const sach = await SachService.updateSach(req.params.id, dto);

    if (!sach) {
        throw new AppError("Không tìm thấy sách", 404);
    }
    return res.status(200).json({
        message: "Cập nhật sách thành công"
    });
});

// Lấy sách dựa theo id
export const getSach = catchAsync(async (req: Request, res: Response<APIResponse<SachResponse>>) => {
    const sach = await SachService.getSachById(req.params.id);

    return res.status(200).json({
        message: "Lấy thông tin sách thành công",
        data: sach
    });
});

// Xóa sách dựa theo id
export const deleteSach = catchAsync(async (req: Request, res: Response) => {
    const sach = await SachService.deleteSach(req.params.id);
    return res.status(200).json({
        message: "Xóa sách thành công"
    });
});

export const getallSach = catchAsync(async (req: Request, res: Response<APIResponse<SachResponse[]>>) => {
    const sachs = await SachService.getAllSach();

    return res.status(200).json({
        message: "Lấy tất cả sách thành công",
        data: sachs
    });
});
