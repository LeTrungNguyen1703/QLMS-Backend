import {Request, Response, NextFunction} from "express";
import TheoDoiMuonSachService from "../Services/TheoDoiMuonSachService";
import {TheoDoiMuonSachRequest} from "../DTO/Request/TheoDoiMuonSachRequest";
import {TheoDoiMuonSachResponse} from "../DTO/Response/TheoDoiMuonSachResponse";
import {plainToInstance} from "class-transformer";
import {APIResponse} from "../DTO/Response/APIResponse";
import {AppError, catchAsync} from "../Middleware/ErrorHandler";

// Interface to extend the Request type to include the TheoDoiMuonSachRequest
interface ITheoDoiMuonSachRequestExtended extends Request {
    body: TheoDoiMuonSachRequest;
}

// Thêm thông tin mượn sách
export const addMuonSach = catchAsync(async (req: ITheoDoiMuonSachRequestExtended, res: Response<APIResponse<TheoDoiMuonSachResponse>>) => {
    const muonSachData = req.body;
    const dto = plainToInstance(TheoDoiMuonSachRequest, muonSachData);

    const muonSach = await TheoDoiMuonSachService.createMuonSach(dto);

    return res.status(201).json({
        message: "Thêm thông tin mượn sách thành công",
        data: muonSach,
    });
});

// Cập nhật thông tin mượn sách
export const updateMuonSach = catchAsync(async (req: ITheoDoiMuonSachRequestExtended, res: Response) => {
    const muonSachData = req.body;
    const dto = plainToInstance(TheoDoiMuonSachRequest, muonSachData);
    const muonSach = await TheoDoiMuonSachService.updateSachMuon(req.params.id, dto);

    return res.status(200).json({
        message: "Cập nhật thông tin mượn sách thành công",
        data: muonSach,
    });
});

// Lấy thông tin mượn sách theo ID
export const getMuonSach = catchAsync(async (req: Request, res: Response<APIResponse<TheoDoiMuonSachResponse>>) => {
    const muonSach = await TheoDoiMuonSachService.getSachMuonById(req.params.id);

    if (!muonSach) {
        throw new AppError("Không tìm thấy thông tin mượn sách", 404);
    }

    return res.status(200).json({
        message: "Lấy thông tin mượn sách thành công",
        data: muonSach,
    });
});

// Xóa thông tin mượn sách
export const deleteMuonSach = catchAsync(async (req: Request, res: Response) => {
    await TheoDoiMuonSachService.deleteSachMuon(req.params.id);
    return res.status(200).json({
        message: "Xóa thông tin mượn sách thành công"
    });
});

// Lấy tất cả thông tin mượn sách
export const getAllMuonSach = catchAsync(async (req: Request, res: Response<APIResponse<TheoDoiMuonSachResponse[]>>) => {
    const muonSachs = await TheoDoiMuonSachService.getAllSachMuon();
    return res.status(200).json({
        message: "Lấy tất cả thông tin mượn sách thành công",
        data: muonSachs,
    });
});

// Lấy thông tin mượn sách theo độc giả
export const getMuonSachByDocGiaId = catchAsync(async (req: Request, res: Response<APIResponse<TheoDoiMuonSachResponse[]>>) => {
    const muonSachs = await TheoDoiMuonSachService.getMuonSachByDocGiaId(req.params.docgiaId);
    return res.status(200).json({
        message: "Lấy thông tin mượn sách theo độc giả thành công",
        data: muonSachs,
    });
});

export const getMuonSachByMaSachId = catchAsync(async (req: Request, res: Response<APIResponse<TheoDoiMuonSachResponse[]>>) => {
    const muonSachs = await TheoDoiMuonSachService.getMuonSachByMaSach(req.params.sachId);
    return res.status(200).json({
        message: "Lấy thông tin mượn sách theo mã sách thành công",
        data: muonSachs,
    });
});
