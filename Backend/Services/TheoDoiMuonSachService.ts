import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import DocGiaRepository from "../Repositories/DocGiaRepository";
import SachRepository from "../Repositories/SachRepository";
import TheoDoiMuonSach, {ITHEODOIMUONSACH} from "../Models/THEODOIMUONSACH";
import {ISach} from "../Models/SACH";
import {plainToInstance} from "class-transformer";
import {TheoDoiMuonSachResponse} from "../DTO/Response/TheoDoiMuonSachResponse";
import {AppError} from "../Middleware/ErrorHandler";
import {TheoDoiMuonSachRequest} from "../DTO/Request/TheoDoiMuonSachRequest";
import {TrangThai} from "../Enums/TrangThai";

class TheoDoiMuonSachService {
    async getAllSachMuon(): Promise<TheoDoiMuonSachResponse[]> {
        const sachMuons = await TheoDoiMuonSachRepository.findAll();
        return sachMuons.map(sachMuon => this.mapToResponse(sachMuon));
    }

    async getSachMuonById(id: string): Promise<TheoDoiMuonSachResponse> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        return this.mapToResponse(sachMuon);
    }

    async getMuonSachByDocGiaId(docGiaId: string): Promise<TheoDoiMuonSachResponse[]> {
        const sachMuons = await TheoDoiMuonSachRepository.findByDocGiaId(docGiaId);
        if (sachMuons?.length === 0 || sachMuons === null) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        return sachMuons.map(sachMuon => this.mapToResponse(sachMuon));
    }

    async getMuonSachByMaSach(maSach: string): Promise<TheoDoiMuonSachResponse[]> {
        const sachMuons = await TheoDoiMuonSachRepository.findByMaSach(maSach);
        if (sachMuons?.length === 0 || sachMuons === null) {
            throw new AppError("Sách chưa được mượn", 404);
        }

        return sachMuons.map(sachMuon => this.mapToResponse(sachMuon));

    }

    async createMuonSach(muonSachData: TheoDoiMuonSachRequest): Promise<TheoDoiMuonSachResponse> {

        await this.kiemTraDocGiaTonTai(muonSachData.MaDocGia.toString())

        await this.kiemTraSachTonTai(muonSachData.MaSach.toString())

        const sach = await this.kiemTraSoLuongSachHienCo(muonSachData.MaSach.toString(), muonSachData.SoQuyen)

        const sachMuon = new TheoDoiMuonSach(muonSachData);

        const sachMuonSaved = await TheoDoiMuonSachRepository.create(sachMuon);

        await this.xuLiSoLuongSachKhiMuon(sach, muonSachData.SoQuyen)

        return this.mapToResponse(sachMuonSaved);
    }

    async updateSachMuon(id: string, muonSachData: Partial<TheoDoiMuonSachRequest>) {
        const sachMuon = new TheoDoiMuonSach(muonSachData);
        const sachUpdated = await TheoDoiMuonSachRepository.update(id, sachMuon);
        if (!sachUpdated) {
            throw new AppError("Cập nhật sách đã mượn không thành công, vui lòng kiểm tra lại dữ liệu", 400);
        }
    }

    async deleteSachMuon(id: string) {
        this.kiemTraTrangThaiSachMuon(id);
        const sachMuonDeleted = await TheoDoiMuonSachRepository.delete(id);
    }

    // Helper method ***************************************************************** //

    private mapToResponse(sachMuon: ITHEODOIMUONSACH): TheoDoiMuonSachResponse {
        return plainToInstance(TheoDoiMuonSachResponse, sachMuon, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            exposeUnsetFields: false
        });
    }

    private async kiemTraDocGiaTonTai(docGiaId: string) {
        const docGia = await DocGiaRepository.findById(docGiaId);
        if (!docGia) {
            throw new AppError("Độc giả không tồn tại", 404);
        }
    }

    private async kiemTraSachTonTai(sachId: string) {
        const sach = await SachRepository.findById(sachId);
        if (!sach) {
            throw new AppError("Sách không tồn tại", 404);
        }
    }

    private async xuLiSoLuongSachKhiMuon(sach: ISach, soQuyen: number) {
        sach.SoQuyen -= soQuyen;
        await SachRepository.update(sach._id.toString(), sach);
    }

    private async kiemTraSoLuongSachHienCo(sachId: string, soQuyen: number): Promise<ISach> {
        const sach = await SachRepository.findById(sachId);
        if (!sach) {
            throw new AppError("Sách không tồn tại", 404);
        }
        if (sach.SoQuyen < soQuyen) {
            throw new AppError("Số lượng sách hiện có không đủ để mượn", 400);
        }

        return sach;

    }

    private async kiemTraTrangThaiSachMuon(id: string) {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }

        if (sachMuon.TrangThai === TrangThai.DA_DUYET || sachMuon.TrangThai === TrangThai.DA_TRA) {
            throw new AppError("Không thể xóa thông tin mượn sách đã được duyệt hoặc đã trả", 400);
        }

    }
}

export default new TheoDoiMuonSachService();
