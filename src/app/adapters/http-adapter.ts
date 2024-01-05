import { Response } from '@angular/http';

/** @ignore */
export class HttpAdapter {
    /**
   * To handle common success response for all api's
   * @param res
   */
  public extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  /**
   * To handle common error response for all api's
   * @param error
   */
  public handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
