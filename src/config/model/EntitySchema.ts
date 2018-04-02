import {AbstractSchema} from "../../model/AbstractSchema";

export class EntitySchema extends AbstractSchema {

  static fromDb(data: any): EntitySchema {
    return new EntitySchema(
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
