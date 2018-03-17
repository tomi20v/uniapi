import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {SchemaRepository} from "../config/repository/SchemaRepository";
import {EntityConfig} from "../config/model/EntityConfig";
import {Subject} from "rxjs/Rx";
import {EntitySchema} from "../config/model/EntitySchema";

export class EntityManager {

  private entityConfigs: Subject<EntityConfig> = new Subject<EntityConfig>();

  constructor(
    private entityConfigRepository: EntityConfigRepository,
    private schemaRepository: SchemaRepository
  ) {
    this.init();
  }

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
          this.entityConfigs.next(entityConfig);
        },
        e => {throw e},
        () => {
          console.log('entity configs loaded');
        }
      );
  }

}
