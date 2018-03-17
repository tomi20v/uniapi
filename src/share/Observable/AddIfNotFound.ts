const _ = require('lodash');

export function addIfNotFound<T>(
  obj: T,
  objs: T[],
  fieldToCompare: string
): T[] {
  if (!_.filter(
    objs,
    eachObj => eachObj[fieldToCompare] == obj[fieldToCompare]
  ).length) {
    objs.push(obj);
  }
  return objs;
}
