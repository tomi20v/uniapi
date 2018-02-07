import {AbstractRepository} from "../share/abstractRepository";
import {CallableInterface} from "../share/callableInterface";
import {PluginConfigSchema} from "./model/PluginConfigSchema";
import {Observable} from "rxjs/Rx";

export class PluginConfigSchemaRepository extends AbstractRepository {

    mongoCollectionName: string = 'ua_plugin';

    factory: CallableInterface<any> = PluginConfigSchema.fromDb;

    create(plugin: PluginConfigSchema) {
        return this._create(plugin);
    }

    protected _idField() {
        return '$id';
    }

}
