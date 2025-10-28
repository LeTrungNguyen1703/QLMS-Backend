import { apiClient } from "./base-url";

export interface SachMuonItem {
  _id: string;
  MaSach: {
    _id: string;
    TenSach: string;
    HinhAnh?: string;
    DonGia: number;
    TacGia: string;
  };
  MaDocGia: {
    _id: string;
    MaDocGia: string;
    TenDocGia: string;
    HoLot: string;
    Ten: string;
  };
  MSDG: string;
  NgayMuon: string;
  NgayTra: string;
  TrangThai: "CHO_DUYET" | "DA_DUYET" | "DA_TRA";
  PhatQuaHan?: {
    message: string;
    SoTienPhat: number;
  };
  // Thông tin chi tiết sách và đọc giả (nếu có populate)
  Sach?: any;
  DocGia?: any;
}

export interface PhatQuaHanRequest {
  soTienPhat: number;
}

export const tinhTrangSachMuonService = {
  // Lấy danh sách sách chờ duyệt
  async getDanhSachChoDuyet(): Promise<SachMuonItem[]> {
    const response = await apiClient.get("/tinhtrangsachmuon/danh-sach-cho-duyet");
    return response.data.data || [];
  },

  // Lấy danh sách sách đã duyệt (đang mượn)
  async getDanhSachDaDuyet(): Promise<SachMuonItem[]> {
    const response = await apiClient.get("/tinhtrangsachmuon/danh-sach-da-duyet");
    return response.data.data || [];
  },

  // Lấy danh sách sách đã trả
  async getDanhSachDaTra(): Promise<SachMuonItem[]> {
    const response = await apiClient.get("/tinhtrangsachmuon/danh-sach-da-tra");
    return response.data.data || [];
  },

  // Lấy danh sách sách quá hạn
  async getDanhSachQuaHan(): Promise<SachMuonItem[]> {
    const response = await apiClient.get("/tinhtrangsachmuon/danh-sach-qua-han");
    return response.data.data || [];
  },

  // Xác nhận cho mượn sách
  async xacNhanChoMuon(id: string): Promise<void> {
    await apiClient.put(`/tinhtrangsachmuon/xac-nhan-cho-muon-sach/${id}`);
  },

  // Xác nhận đã trả sách
  async xacNhanDaTra(id: string): Promise<void> {
    await apiClient.put(`/tinhtrangsachmuon/xac-nhan-da-tra-sach/${id}`);
  },

  // Phạt mượn sách quá hạn
  async phatQuaHan(id: string, soTienPhat: number): Promise<void> {
    await apiClient.put(`/tinhtrangsachmuon/phat-muon-sach-qua-han/${id}`, {
      soTienPhat,
    });
  },

  // Từ chối cho mượn sách
  async tuChoiChoMuon(id: string, lyDo?: string): Promise<void> {
    await apiClient.delete(`/tinhtrangsachmuon/tu-choi-cho-muon-sach/${id}`, {
      data: { lyDo },
    });
  },
};

