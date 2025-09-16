import mongoose from "mongoose";
import {Expose, Transform} from "class-transformer";

export class NhaXuatBanResponse {
    @Expose()
    @Transform(({obj}) => obj._id.toString())
    _id: string;
    @Expose()
    MaNXB: string;
    @Expose()
    TenNXB: string;
    @Expose()
    DiaChi: string;
}
    