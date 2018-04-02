import {AbstractRepository} from "../../share/AbstractRepository";
import {PluginConfigSchema} from "../model/PluginConfigSchema";

export class PluginConfigSchemaRepository extends AbstractRepository {

  collectionName: string = 'uaPluginConfigSchema';

  factory: ((data: object) => PluginConfigSchema) = PluginConfigSchema.fromDb;

  create(plugin: PluginConfigSchema) {
    return this._create(plugin);
  }

  protected _idField() {
    return '$id';
  }

}
