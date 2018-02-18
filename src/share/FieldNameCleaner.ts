const _ = require('lodash');

export class FieldNameCleaner {

    clearFieldNames(obj: object) {
        return this.clearCore(obj, this.clearFieldName
        );
    }

    restoreFieldNames(obj: any) {
        return this.clearCore(obj, this.restoreFieldName);
    }

    public clearFieldName(fieldName: string): string {
        return fieldName[0] == '$'
            ? '_' + fieldName
            : fieldName;
    }

    public restoreFieldName(fieldName: string): string {
        return fieldName.substr(0, 2) === '_$'
            ? fieldName.substr(1)
            : fieldName
    }

    private clearCore(obj: object, cb) {
        let ret = {};
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                let clearKey = cb(i);
                if (_.isArray(obj[i])) {
                    ret[clearKey] = this.clearArray(obj[i]);
                }
                else if (_.isObject(obj[i])) {
                    ret[clearKey] = this.clearFieldNames(obj[i]);
                }
                else {
                    ret[clearKey] = obj[i];
                }
            }
        }
        return ret;
    }

    private clearArray(obj) {
        let ret = [];
        obj.forEach((eachVal, eachKey) => {
            if (_.isArray(eachVal)) {
                ret[eachKey] = this.clearArray(eachVal);
            }
            else if (_.isObject(eachVal)) {
                ret[eachKey] = this.clearFieldNames(eachVal);
            }
            else {
                ret[eachKey] = eachVal;
            }
        });
        return ret;
    }

}
