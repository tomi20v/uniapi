import {AbstractSchema} from "./AbstractSchema";

export class Plugin extends AbstractSchema {

    static fromDb(data: any): Plugin {
        return new Plugin(
            data._id,
            data._$schema,
            data.title,
            data.type,
            data.properties,
            data.definitions,
            data.required
        );
    }

}
