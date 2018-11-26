import {
    PluginSpecificConfiguration,
    Request,
    ResponseToolkit,
    RouteOptionsCors,
    RouteOptionsValidate,
    Server
} from "hapi";
import {Result} from "../models/result";
import {RouteData} from "./route-data";

export abstract class BaseRoutes {
    protected static configureRoutes(
        name: string,
        path: string,
        application: string,
        version: number,
        method: string,
        action: (request: Request, h: ResponseToolkit) => Promise<Result>,
        auth: false | string | object = 'jwt',
        prefix?: string,
        validate?: RouteOptionsValidate,
        tags?: string[],
        plugins?: PluginSpecificConfiguration,
        description?: string,
        cors?: boolean | RouteOptionsCors)

        : RouteData {

        path = (prefix ? `/${prefix}` : '') + `/v${version}/${path}`;

        return new RouteData(
            // name,
            // application,
            // version,
            method.toUpperCase(),
            path,
            action,
            {
                auth,
                validate,
                tags,
                description,
                cors,
                handler: action,
                plugins: new RouteExtraInfo(application),
                notes: JSON.stringify({ application })
            });
    }

    public abstract get routes(): RouteData[];

    public register(server: Server) {
        for (const r of this.routes) {
            server.route(r);
        }
    }
}

export class RouteExtraInfo implements PluginSpecificConfiguration {
    constructor (public application: string) {

    }
}