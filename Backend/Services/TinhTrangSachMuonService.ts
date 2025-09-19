import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import {AppError} from "../Middleware/ErrorHandler";
import {TrangThai} from "../Enums/TrangThai";

class TinhTrangSachMuonService {

    async xacNhanChoMuonSach(id: string): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        this.kiemTraTrangThaiMuonSach(sachMuon.TrangThai);

        await TheoDoiMuonSachRepository.update(id, {TrangThai: TrangThai.DA_DUYET});
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

        await TheoDoiMuonSachRepository.update(id, {TrangThai: TrangThai.DA_TRA});
    }

    async phatMuonSachQuaHan(id: string, soTienPhat: number): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        const vuotThoiHanTra = this.kiemTraCoVuotThoiGianTra(sachMuon.NgayTra);
        
        if (vuotThoiHanTra) {
            await TheoDoiMuonSachRepository.update(id, {
                PhatQuaHan: {
                    message: "Độc giả đã trả sách quá hạn",
                    SoTienPhat: soTienPhat
                }
            });
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

    private kiemTraCoVuotThoiGianTra(NgayTra: Date): boolean {
        return (NgayTra.getTime() > Date.now());
    }
}

export default new TinhTrangSachMuonService();