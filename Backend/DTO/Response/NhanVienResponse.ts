import {Expose, Transform} from "class-transformer";

export class NhanVienResponse {
    @Expose()
    @Transform(({obj}) => obj._id.toString())
    _id: string;
    @Expose()
    MSNV: string;
    @Expose()
    HoTenNV: string;
    @Expose()
    DiaChi: string;
    @Expose()
    SoDienThoai: string;
}

