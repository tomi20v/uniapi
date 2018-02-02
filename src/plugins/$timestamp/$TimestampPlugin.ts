import {PluginInterface} from "../PluginInterface";
import {PluginEventInterface} from "../PluginEventInterface";
import {AbstractSchema} from "../../model/AbstractSchema";
import {$TimestampConfigInterface} from "./$TimestampConfigInterface";

export class $TimestampPlugin implements PluginInterface {

    public static id = '$timestamp';

    private FORMAT_TIMESTAMP = 'timestamp';

    handle(event: PluginEventInterface, config: $TimestampConfigInterface): boolean {
        if (!config.enabled) {
            return false;
        }
        const eventMap = [
            { pattern: /^schema\.compile$/, callback: this.addFieldsToSchema},
            { pattern: /\.created$/, callback: this.setStamps},
            { pattern: /\.changed$/, callback: this.setStamps},
        ];
        eventMap.forEach(each => {
            if (each[0].test(event.eventName)) {
                return each[1].call(this, event.value, config);
            }
        });
    }

    private addFieldsToSchema(schema: AbstractSchema, config: $TimestampConfigInterface) {
        if (config.onCreate) {
            const field = config.onCreateField;
            schema.properties[field] = this.schemaByFormat(field, config.format, schema.properties[field]);
        }
        if (config.onUpdate && !schema.properties[config.onUpdateField]) {
            const field = config.onUpdateField;
            schema.properties[field] = this.schemaByFormat(field, config.format, schema.properties[field]);
        }
        return true;
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

    private setStamps(entity: any, config: $TimestampConfigInterface) {
        if (config.onCreate && !entity[config.onCreateField]) {
            entity[config.onCreateField] = this.stampByFormat(config.format);
        }
        if (config.onUpdate) {
            entity[config.onUpdateField] = this.stampByFormat(config.format);
        }
        return true;
    }

    private stampByFormat(format: string) {
        switch (format) {
            case this.FORMAT_TIMESTAMP:
            default:
                return Math.floor(new Date().getTime() / 1000);
        }
    }


}
