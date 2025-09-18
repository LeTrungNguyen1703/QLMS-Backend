import {Expose} from "class-transformer";

export class TokenResponse {
    
    @Expose()
    Token: string;
}