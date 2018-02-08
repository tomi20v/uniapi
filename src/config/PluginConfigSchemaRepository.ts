import {AbstractRepository} from "../share/AbstractRepository";
import {CallableInterface} from "../share/CallableInterface";
import {PluginConfigSchema} from "./model/PluginConfigSchema";

export class PluginConfigSchemaRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaPluginConfigSchema';

    factory: CallableInterface<any> = PluginConfigSchema.fromDb;

    create(plugin: PluginConfigSchema) {
        return this._create(plugin);
    }

    protected _idField() {
        return '$id';
    }

}
