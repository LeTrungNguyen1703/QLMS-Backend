import {Expose} from "class-transformer";
import Token from "../../Middleware/Token";

export class TokenResponse {
    
    @Expose()
    Token: string;
    @Expose()
    UserName: string;
    @Expose()
    Email: string;


    constructor(Token: string, UserName: string, Email: string) {
        this.Token = Token;
        this.UserName = UserName;
        this.Email = Email;
    }
}