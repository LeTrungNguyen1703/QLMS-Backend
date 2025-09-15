export class APIResponse<T> {
    message: string;
    data?: T;

    constructor(data?: any) {
        this.message = "Success";
        if (data !== undefined) {
            this.data = data;
        }
    }
}

export class APIResponseError extends APIResponse<null> {
    constructor(message: string) {
        super(null);
        this.message = message;
    }
    
}