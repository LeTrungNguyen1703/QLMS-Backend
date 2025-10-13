import {Expose} from "class-transformer";
import {SachResponse} from "./SachResponse";
import {DocGiaResponse} from "./DocGiaResponse";


export class TheoDoiMuonSachResponse {

    @Expose()
    _id: string;

    @Expose()
    MaDocGia: DocGiaResponse;

    @Expose()
    MaSach: SachResponse;

    @Expose()
    NgayMuon: Date;

    @Expose()
    NgayTra: Date;

    @Expose()
    SoQuyen: number;

    @Expose()
    TrangThai: String;

    @Expose()
    PhatQuaHan: {
        message: String,
        SoTienPhat: number
    };
}
