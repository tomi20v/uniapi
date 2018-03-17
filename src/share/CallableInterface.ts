// @todo remove this as this kind of typehinting can be done in ts
export interface CallableInterface<T> {
  (...args: any[]): T;
}
