const _ = require('lodash');

export class FieldNameCleaner {

    clearFieldNames(obj: object) {
        return this.clearCore(obj, (eachKey: string) =>
            eachKey[0] == '$' ? '_' + eachKey : eachKey
        );
    }

    restoreFieldNames(obj: any) {
        return this.clearCore(obj, (eachKey: string) =>
            eachKey.substr(0, 2) === '_$' ? eachKey.substr(1) : eachKey
        );
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
