import TheoDoiMuonSachService from "./TheoDoiMuonSachService";
import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import {AppError} from "../Middleware/ErrorHandler";

class TinhTrangSachMuonService {

    async xacNhanChoMuonSach(id: string): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        this.kiemTraTrangThaiMuonSach(sachMuon.TrangThai);

        await TheoDoiMuonSachRepository.update(id, {TrangThai: "DA_DUYET"});
    }

    async xacNhanDaTraSach(id: string): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        this.kiemTraTrangThaiMuonSach(sachMuon.TrangThai);
        if (sachMuon.TrangThai == "CHO_DUYET") {
            throw new AppError("Sách chưa được xác nhận cho mượn", 400);
        }
        
        await TheoDoiMuonSachRepository.update(id, {TrangThai: "DA_TRA"});
    }
    
    async huyMuonSach(id: string): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        this.kiemTraChoPhepHuyMuonSach(sachMuon.TrangThai);
        
        await TheoDoiMuonSachRepository.delete(id);
    }

    async phatMuonSachQuaHan(id: string, soTienPhat: number): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
    }
    
    private kiemTraTrangThaiMuonSach(TrangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA"): void {
        if (TrangThai === "DA_DUYET") {
            throw new AppError("Sách đã được xác nhận cho mượn", 400);
        }
        if (TrangThai === "DA_TRA") {
            throw new AppError("Sách đã được trả", 400);
        }

    }

    private kiemTraChoPhepHuyMuonSach(TrangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA") {
        if (TrangThai === "DA_DUYET" || TrangThai === "DA_TRA") {
            throw new AppError("Không thể hủy mượn sách đã được duyệt hoặc đã trả", 400);
        }
    }
}