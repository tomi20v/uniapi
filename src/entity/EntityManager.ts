import {EntityRepository} from "../config/EntityRepository";
import {SchemaRepository} from "../config/SchemaRepository";
import {EntityConfig} from "../config/model/EntityConfig";
import {ServerEventInterface} from "../server/ServerEventInterface";
import {Subject} from "rxjs/Subject";
import {EntitySchema} from "../config/model/EntitySchema";

export class EntityManager {

    private entityConfigs: EntityConfig[] = [];

    constructor(
        private entityConfigRepository: EntityRepository,
        private schemaRepository: SchemaRepository,
        private serverSubject: Subject<ServerEventInterface>
    ) {}

    public init() {
        this.entityConfigRepository.find({})
            .flatMap((entityConfig: EntityConfig) => {
                return this.schemaRepository.find({_id: entityConfig.schema})
                    .map((schema: EntitySchema) => {
                        entityConfig.schema = schema;
                        return entityConfig;
                    })
            })
            .subscribe(
                (entityConfig: any) => {
                    //console.log('entity', entityConfig)
                    this.entityConfigs.push(entityConfig);
                },
                e => {throw e},
                () => {
                    // emit entityManager.ready or similar
                    console.log('entity configs loaded');
                    this.serverSubject.next(<ServerEventInterface>{
                        eventName: 'server.ready',
                        data: 'EntityManager'
                    });
                }
            );
    }
}
