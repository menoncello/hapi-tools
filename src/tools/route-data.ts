import {Request, ResponseToolkit, ServerRoute} from 'Hapi';
import {UserRepository} from "../repositories/user-repository";

import {CustomLogger, monitor} from 'logging-monitor-tool';
import {AuthCredentials, RouteOptions} from "hapi";

const logger = new CustomLogger();

export class RouteData implements ServerRoute {
    // private readonly userRepository: UserRepository = new UserRepository();
    // private rules?: object;
    // private vhost?: string | string[];
    // private options?: RouteOptions | ((server: Server) => RouteOptions);

    constructor(
        // private name: string,
        // private application: string,
        // private version: number,
        public method: string,
        public path: string,
        handler: (request: Request, h: ResponseToolkit) => Promise<any>,
        public options: RouteOptions) {
        // options.handler = this.handler;
    }

    // public async handler(request: Request, h: ResponseToolkit): Promise<any> {
    //     return await monitor(
    //         '',// /`${this.application}.v${this.version}.${name}`,
    //         async () => await this.execute(request, h)
    //     );
    // }

    public async execute(request: Request, h: ResponseToolkit): Promise<any> {
        let r = null;

        if (!this.options.auth ||
            await this.checkRoute(request.auth.credentials, ''
            // this.application
                , this.path, this.method)) {
            // r = await this.action(request, h);
        } else {
            r = h.response({
                success: false,
                message: 'access denied'
            }).code(401);
        }

        return r;
    }

    private async checkRoute(credentials: AuthCredentials, app: string, path: string, method: string) {
        try {
            const cred: any = credentials;
            cred.user = cred.user || '';
            return true; // await this.userRepository.hasAccess(cred.user, app, path, method);
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // toRoute(): ServerRoute {
    //     return {
    //         path: this.path,
    //         // handler: this.handler,
    //         method: this.method,
    //         // rules: this.rules,
    //         // vhost: this.vhost,
    //         options: {
    //             auth: this.auth,
    //             handler: this.handler,
    //             validate: this.validate,
    //             tags: this.tags,
    //             plugins: this.plugins,
    //             description: this.description,
    //             cors: this.cors
    //         }
    //     };
    // }
}
