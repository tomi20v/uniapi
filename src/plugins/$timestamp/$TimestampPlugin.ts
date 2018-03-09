import {IPluginHandlerDefinition, PluginInterface} from "../PluginInterface";
import {PluginEventInterface} from "../PluginEventInterface";
import {AbstractSchema} from "../../model/AbstractSchema";
import {$TimestampConfigInterface} from "./$TimestampConfigInterface";

export class $TimestampPlugin implements PluginInterface {

    readonly id = '$timestamp';

    readonly handlers: IPluginHandlerDefinition[] = [
        { pattern: /^schema\.compile$/, callback: this.addFieldsToSchema},
        { pattern: /\.created$/, callback: this.setStamps},
        { pattern: /\.changed$/, callback: this.setStamps},
        { pattern: /entity\.preroute/, callback: this.happened},
    ];

    private FORMAT_TIMESTAMP = 'timestamp';

    // handle(
    //     event: PluginEventInterface,
    //     config: $TimestampConfigInterface
    // ): PluginEventInterface {
    //     if (!config.enabled) {
    //         return event;
    //     }
    //     const eventMap = [
    //         { pattern: /^schema\.compile$/, callback: this.addFieldsToSchema},
    //         { pattern: /\.created$/, callback: this.setStamps},
    //         { pattern: /\.changed$/, callback: this.setStamps},
    //         { pattern: /entity\.preroute/, callback: this.happened},
    //     ];
    //     eventMap.forEach(each => {
    //         if (each.pattern.test(event.eventName)) {
    //             each.callback.call(this, event, config);
    //         }
    //     });
    //     return event;
    // }

    // handleServerEvent(event: ServerEventInterface) {
    //     switch (event.eventName) {
    //         case 'server.initdb':
    //             return this.initDbActor.initDb(<InitDbData>event);
    //     }
    // }

public happened(event: PluginEventInterface) {
    // console.log('it happened', event.eventName, event.context);
    event.value.headers.fck = 'anal';
    return event;
}

    public addFieldsToSchema(
        event: PluginEventInterface,
        config: $TimestampConfigInterface
    ) {
        let schema: AbstractSchema = event.value;
        if (config.onCreate) {
            const field = config.onCreateField;
            schema.properties[field] = this.schemaByFormat(field, config.format, schema.properties[field]);
        }
        if (config.onUpdate && !schema.properties[config.onUpdateField]) {
            const field = config.onUpdateField;
            schema.properties[field] = this.schemaByFormat(field, config.format, schema.properties[field]);
        }
        return event;
    }

    public setStamps(
        event: PluginEventInterface,
        config: $TimestampConfigInterface
    ) {
        let entity: any = event.value;
        if (config.onCreate && !entity[config.onCreateField]) {
            entity[config.onCreateField] = this.stampByFormat(config.format);
        }
        if (config.onUpdate) {
            entity[config.onUpdateField] = this.stampByFormat(config.format);
        }
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
