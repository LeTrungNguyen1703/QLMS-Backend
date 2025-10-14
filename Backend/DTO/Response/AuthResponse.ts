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

    @Expose()
    Role: string;

    constructor(Token: string, UserId: string, UserName: string, Email: string, Role: string) {
        this.Token = Token;
        this.UserId = UserId;
        this.UserName = UserName;
        this.Email = Email;
        this.Role = Role
    }
}