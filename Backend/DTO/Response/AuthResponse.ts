import {Expose} from "class-transformer";
import Token from "../../Middleware/Token";

export class TokenResponse {
    
    @Expose()
    Token: string;

    @Expose()
    UserId: string;

    @Expose()
    UserName: string;

    @Expose()
    Email: string;


    constructor(Token: string, UserId: string, UserName: string, Email: string) {
        this.Token = Token;
        this.UserId = UserId;
        this.UserName = UserName;
        this.Email = Email;
    }
}