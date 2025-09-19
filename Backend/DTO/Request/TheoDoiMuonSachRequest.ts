import {IsDate, IsNotEmpty, IsNumber, Min} from "class-validator";


export class TheoDoiMuonSachRequest {

    @IsNotEmpty({message: "Vui lòng nhập mã sách"})
    MaSach: string;

    @IsNotEmpty({message: "Vui lòng nhập số quyển"})
    @IsNumber({}, {message: "Số quyển phải là số"})
    @Min(1, {message: "Số quyển phải lớn hơn 0"})
    SoQuyen: number;

}