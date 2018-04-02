import {IPlugin, IPluginHandlerDefinition} from "./IPlugin";
import {IPluginConfig} from "../IPluginConfig";
import {EntityRepositoryManager} from "../../entity/EntityRepositoryManager";
import {EntityRepository} from "../../entity/EntityRepository";

export abstract class APlugin implements IPlugin {

  readonly id;

  abstract readonly handlers: IPluginHandlerDefinition[];
  // abstract readonly config: IPluginConfig;
  // abstract readonly configHash: string;

  constructor(
    readonly config: IPluginConfig,
    readonly configHash: string,
    protected entityRepositoryManager: EntityRepositoryManager
  ) {}

  protected entityRepository(entity: string): EntityRepository {
    if (!entity) {
      throw 'target entity missing';
    }
    return this.entityRepositoryManager.getRepository(entity);
  }

}
