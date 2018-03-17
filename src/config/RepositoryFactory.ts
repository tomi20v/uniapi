import {FieldNameCleaner} from "../share/FieldNameCleaner";
import {SchemaRepository} from "./repository/SchemaRepository";
import {AppConfigRepository} from "./repository/AppConfigRepository";
import {PluginConfigSchemaRepository} from "./repository/PluginConfigSchemaRepository";
import {EntityConfigRepository} from "./repository/EntityConfigRepository";
import {ConnectionFactory} from "../ConnectionFactory";

export class RepositoryFactory {

  private entityConfigRepositoryI: EntityConfigRepository;
  private entitySchemaRepositoryI: SchemaRepository;
  private pluginConfigSchemaRepositoryI: PluginConfigSchemaRepository;
  private appConfigRepositoryI: AppConfigRepository;

  constructor(
    private connectionFactory: ConnectionFactory,
    private fieldNameCleaner?: FieldNameCleaner
  ) {
    this.fieldNameCleaner = fieldNameCleaner
      ? fieldNameCleaner
      : new FieldNameCleaner();
  }

  entityConfigRepository(): EntityConfigRepository {
    this.entityConfigRepositoryI = this.entityConfigRepositoryI ||
      new EntityConfigRepository(
        this.connectionFactory.connection,
        this.fieldNameCleaner
      );
    return this.entityConfigRepositoryI;
  }
  entitySchemaRepository(): SchemaRepository {
    this.entitySchemaRepositoryI = this.entitySchemaRepositoryI ||
      new SchemaRepository(
        this.connectionFactory.connection,
        this.fieldNameCleaner
      );
    return this.entitySchemaRepositoryI;
  }
  pluginConfigSchemaRepository(): PluginConfigSchemaRepository {
    this.pluginConfigSchemaRepositoryI = this.pluginConfigSchemaRepositoryI ||
      new PluginConfigSchemaRepository(
        this.connectionFactory.connection,
        this.fieldNameCleaner
      );
    return this.pluginConfigSchemaRepositoryI;
  }
  appConfigRepository():AppConfigRepository {
    this.appConfigRepositoryI = this.appConfigRepositoryI ||
      new AppConfigRepository(
        this.connectionFactory.connection,
        this.fieldNameCleaner
      );
    return this.appConfigRepositoryI;
  }

}
