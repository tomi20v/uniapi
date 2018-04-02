import {EntityRepository} from "./EntityRepository";
import {ConnectionFactory} from "../ConnectionFactory";

export class EntityRepositoryManager {

  private instances: EntityRepository[] = [];

  constructor(
    private connectionFactory: ConnectionFactory
  ) {}

  getRepository(entityName: string): EntityRepository {
    let instances = this.instances.filter(each => each.entityName == entityName);
    if (!instances.length) {
      const instance = new EntityRepository(entityName, this.connectionFactory.connection$);
      this.instances.push(instance);
      instances = [instance];
    }
    return instances[0];
  }

}
