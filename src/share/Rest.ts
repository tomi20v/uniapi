import {Response} from "express";
import {Observable} from "rxjs/Rx";
export class Rest {

  static subscribeToOne(
    observable: Observable<any>,
    response: Response,
    proto?: any
  ) {
    observable.map(each => {
      return proto
        ? Rest.responseObjectFactory(each, proto)
        : each;
    })
      .subscribe(
        (result) => Rest.response(response, true, result),
        (err) => Rest.response(response, false, err),
        () => null
      )

  }

  static responseObjectFactory<T>(result: any, target: T): T {
    for (let i in result) {
      if (result.hasOwnProperty(i) && target.hasOwnProperty(i)) {
        target[i] = result[i];
      }
    }
    return target;
  }

  /**
   * @TODO I should handle error response codes
   */
  static response(response: Response, success: boolean, result: any, errorMessage?: any) {
    let r = success
      ? {
        ok: true,
        result: result
      }
      : {
        ok: false,
        error: result,
        errorMessage: errorMessage || ''
      };
    return response.json(r);
  }

}
