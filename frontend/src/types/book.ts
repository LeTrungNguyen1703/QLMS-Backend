// Book and Borrow tracking types

export interface Sach {
  _id: string;
  MaSach: string;
  HinhAnh?: string;
  TenSach: string;
  DonGia: number;
  SoQuyen: number;
  NamXuatBan: string;
  IdNxb: string | NhaXuatBan;
  TacGia: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NhaXuatBan {
  _id: string;
  MaNXB: string;
  TenNXB: string;
  DiaChi: string;
}

export enum TrangThaiMuonSach {
  CHO_DUYET = "Chờ duyệt",
  DA_DUYET = "Đã duyệt",
  DA_TRA = "Đã trả"
}

export interface TheoDoiMuonSach {
  _id: string;
  MaDocGia: string;
  MaSach: string | Sach;
  NgayMuon: string;
  NgayTra: string;
  TrangThai: TrangThaiMuonSach;
  SoQuyen: number;
  PhatQuaHan: {
    message: string;
    SoTienPhat: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MuonSachRequest {
  MaSach: string;
  SoQuyen: number;
  NgayMuon?: string;
}

