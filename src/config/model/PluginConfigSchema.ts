import {AbstractSchema} from "../../model/AbstractSchema";

export class PluginConfigSchema extends AbstractSchema {

    static fromDb(data: any): PluginConfigSchema {
        return new PluginConfigSchema(
            data._id,
            data.$schema,
            data.title,
            data.type,
            data.properties,
            data.definitions,
            data.required
        );
    }

}
