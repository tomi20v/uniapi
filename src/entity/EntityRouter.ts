import {NextFunction, Request, Response} from "express-serve-static-core";
import {Context} from "../plugins/Context";
import {PluginManager} from "../plugins/PluginManager";

export class EntityRouter {

    constructor(
        private pluginManager: PluginManager
    ) {

    }

    handle(req: Request, res: Response, next: NextFunction): any {

        next();
    }
}
