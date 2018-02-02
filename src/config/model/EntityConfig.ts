/**
 * this is NOT an entity but the meta info for the entity
 */
export class EntityConfig {

    constructor(
        public _id: string,
        public name: string,
        public schema: any,
        public tstamp: Date|null,
        public crstamp: Date|null
    ) {}

    static fromDb(data: any) {
        return new EntityConfig(
            data._id,
            data.name,
            data.schema,
            data.tstamp,
            data.crstamp
        );
    }
}
