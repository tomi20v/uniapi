import {AbstractSchema} from "./AbstractSchema";

export class Schema extends AbstractSchema {

    static fromDb(data: any): Schema {
        return new Schema(
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
