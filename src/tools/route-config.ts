import {Request, ResponseToolkit} from "hapi";
import {Result} from "../models/result";

export class RouteConfig {
    constructor (public handler: (request: Request, h: ResponseToolkit) => Promise<Result>,
                 public auth: false | string | object) {

    }
}
