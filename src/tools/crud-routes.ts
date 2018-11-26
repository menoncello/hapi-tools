import * as _ from "lodash";

import {Request} from 'Hapi';
import {BaseModel} from "../models/base-model";
import {BaseRepository} from "../repositories/base-repository";
import {RouteData} from "./route-data";
import {BaseRoutes} from "./base-routes";

export abstract class CrudRoutes<T extends BaseModel, TRepository extends BaseRepository<T>> extends BaseRoutes {
    protected constructor(public application: string, public name: string, public path: string, public version: number,
                          public repository: TRepository) {
        super();
    }

    protected abstract customRoutes() : RouteData[];

    public get routes() {
        return _.union(
            this.customRoutes(),
            [
                CrudRoutes.configureRoutes(
                    `${this.name}.list`,
                    this.path,
                    this.application,
                    this.version,
                    'GET',
                    () => this.repository.find({}),
                    'jwt'
                ),

                CrudRoutes.configureRoutes(
                    `${this.name}.create`,
                    this.path,
                    this.application,
                    this.version,
                    'POST',
                    (request: Request) => this.repository.insertOne(request.payload as T)
                ),

                CrudRoutes.configureRoutes(
                    `${this.name}.get`,
                    `${this.path}/{id}`,
                    this.application,
                    this.version,
                    'GET',
                    (request: Request) => this.repository.findOne(request.params.id)
                ),

                CrudRoutes.configureRoutes(
                    `${this.name}.remove`,
                    `${this.path}/{id}`,
                    this.application,
                    this.version,
                    'DELETE',
                    (request: Request) => this.repository.remove(request.params.id)
                ),

                CrudRoutes.configureRoutes(
                    `${this.name}.update`,
                    `${this.path}/{id}`,
                    this.application,
                    this.version,
                    'PUT',
                    (request: Request) => this.repository.updateOne(request.params.id, request.payload as T)
                )
            ]);
    }
}