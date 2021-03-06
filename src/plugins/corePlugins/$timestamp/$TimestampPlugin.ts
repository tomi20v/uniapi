import {IPluginHandlerDefinition, IPlugin} from "../../plugin/IPlugin";
import {IPluginEvent} from "../../pluginEvent/IPluginEvent";
import {AbstractSchema} from "../../../model/AbstractSchema";
import {$TimestampConfigInterface} from "./$TimestampConfigInterface";
import {APlugin} from "../../plugin/APlugin";
import {EntityRepositoryManager} from "../../../entity/EntityRepositoryManager";
import {IPluginEntityEvent} from "../../pluginEvent/IPluginEntityEvent";

export class $TimestampPlugin extends APlugin implements IPlugin {

  readonly id = '$timestamp';

  /**
   * NOTE these events are not used ATM...?
   */
  readonly handlers: IPluginHandlerDefinition[] = [
    // { pattern: /^schema\.compile$/, callback: this.addFieldsToSchema},
    // { pattern: /\.created$/, callback: this.setStamps},
    // { pattern: /\.changed$/, callback: this.setStamps},
    { pattern: /entity\.before$/, callback: this.setStamps},
  ];

  private readonly FORMAT_TIMESTAMP = 'timestamp';

  constructor(
    readonly config: $TimestampConfigInterface,
    readonly configHash: string,
    protected entityRepositoryManager: EntityRepositoryManager
  ) {
    super(config, configHash, entityRepositoryManager);
  }

  public addFieldsToSchema(
    event: IPluginEvent<AbstractSchema,any>
  ) {
    let schema: AbstractSchema = event.value;
    if (this.config.onCreate) {
      const field = this.config.onCreateField;
      schema.properties[field] = this.schemaByFormat(field, this.config.format, schema.properties[field]);
    }
    if (this.config.onUpdate && !schema.properties[this.config.onUpdateField]) {
      const field = this.config.onUpdateField;
      schema.properties[field] = this.schemaByFormat(field, this.config.format, schema.properties[field]);
    }
    return event;
  }

  public setStamps(
    event: IPluginEntityEvent
  ): IPluginEntityEvent {
    // let entity: any = event.target.data;
    // if (this.config.onCreate && !entity[this.config.onCreateField]) {
    //   entity[this.config.onCreateField] = this.stampByFormat(this.config.format);
    // }
    // if (this.config.onUpdate) {
    //   entity[this.config.onUpdateField] = this.stampByFormat(this.config.format);
    // }
    return event;
  }

  private schemaByFormat(key: string, format: string, current: any): object {
    switch (format) {
      case this.FORMAT_TIMESTAMP:
      default:
        return {...current,
          $id: "/properties/" + key,
          type: "integer",
          title: current.title || "created at"
        };
    }
  }

  private stampByFormat(format: string) {
    switch (format) {
      case this.FORMAT_TIMESTAMP:
      default:
        return Math.floor(new Date().getTime() / 1000);
    }
  }

}
