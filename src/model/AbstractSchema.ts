export abstract class AbstractSchema {

    constructor(
        public $id: string,
        public $schema: string,
        public title: string,
        public type: string,
        public properties: object,
        public definitions: object,
        public required: any[]
    ) {}

}
