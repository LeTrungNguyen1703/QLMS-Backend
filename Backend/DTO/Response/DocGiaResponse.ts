import {Expose, Transform} from "class-transformer";

export class DocGiaResponse {
    @Expose()
    @Transform(({obj}) => obj._id.toString())
    _id: string;
    @Expose()
    MaDocGia: string;
    @Expose()
    HoLot: string;
    @Expose()
    Ten: string;
    @Expose()
    TenTaiKhoan: string;
    @Expose()
    NgaySinh: Date;
    @Expose()
    Phai: "nam" | "nữ" | "khác";
    @Expose()
    DiaChi: string;
    @Expose()
    SoDienThoai: string;
}
