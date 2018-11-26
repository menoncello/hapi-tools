export class Result {
    constructor (public success: boolean, public withError?: boolean, public error?: any, public data?: any) {
        this.withError = withError || false;
    }
}
