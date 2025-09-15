export interface IDocGiaResponse {
    _id: string;
    MaDocGia: string;
    HoLot: string,
    Ten: string,
    NgaySinh: Date,
    Phai: "nam" | "nữ" | "khác",
    DiaChi: string,
    SoDienThoai: string
}