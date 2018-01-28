export class Entity {

    constructor(
        public _id: string,
        public name: string,
        public schema: any,
        public tstamp: Date|null,
        public crstamp: Date|null
    ) {}

    static fromDb(data: any) {
        return new Entity(
            data._id,
            data.name,
            data.schema,
            data.tstamp,
            data.crstamp
        );
    }
}
