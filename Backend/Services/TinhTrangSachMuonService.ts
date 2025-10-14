import TheoDoiMuonSachRepository from "../Repositories/TheoDoiMuonSachRepository";
import {AppError} from "../Middleware/ErrorHandler";
import {TrangThai} from "../Enums/TrangThai";

class TinhTrangSachMuonService {

    async xacNhanChoMuonSach(id: string): Promise<void> {
        const sachMuon = await this.kiemTraSachDaMuon(id);

        this.kiemTraTrangThaiMuonSach(sachMuon.TrangThai);

        await TheoDoiMuonSachRepository.update(id, {TrangThai: TrangThai.DA_DUYET});
    }

    async xacNhanDaTraSach(id: string): Promise<void> {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
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

    async tuChoiChoMuonSach(id: string, lyDo?: string): Promise<void> {
        const sachMuon = await this.kiemTraSachDaMuon(id);

        if (sachMuon.TrangThai !== TrangThai.CHO_DUYET) {
            throw new AppError("Chỉ có thể từ chối sách đang chờ duyệt", 400);
        }

        // Có thể xóa hoặc đánh dấu là đã từ chối
        await TheoDoiMuonSachRepository.delete(id);
    }

    async getDanhSachTheoTrangThai(trangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA"): Promise<any[]> {
        return await TheoDoiMuonSachRepository.findByCondition({ TrangThai: trangThai });
    }

    async getDanhSachSachQuaHan(): Promise<any[]> {
        const sachDangMuon = await TheoDoiMuonSachRepository.findByCondition({
            TrangThai: TrangThai.DA_DUYET
        });

        const ngayHienTai = new Date();

        return sachDangMuon.filter(sach => {
            return new Date(sach.NgayTra).getTime() < ngayHienTai.getTime();
        });
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
        return (NgayTra.getTime() < Date.now());
    }

    private async kiemTraSachDaMuon(id: string) {
        const sachMuon = await TheoDoiMuonSachRepository.findById(id);
        if (!sachMuon) {
            throw new AppError("Sách chưa được mượn", 404);
        }
        return sachMuon;
    }
}

export default new TinhTrangSachMuonService();