import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

/**
 * signup service class
 */
@Injectable()
export class SignupService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService
    // private commonHttpAdaptorService: CommonHttpAdapterService
  ) { }

  /**
   * To signup
   * @param any data
   */
  signup(data: any): Observable<any[]> {
    return this.http.post(this.config.apiAuthEndPoint + 'signup', data)
    .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

  /** @ignore */
  public extractData(res: Response | any) {
    return res || {};
  }

  /** @ignore */
  public handleError(error: Response| any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg);
  }

}
