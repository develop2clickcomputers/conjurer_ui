import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';

/**
 * Carrier service class
 */
@Injectable()
export class CarrierService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService
  ) { }

  /**
   * To get all carriers that has been added
   */
  getCarriers(): Observable<any> {
    let carrierData: any = {};
    carrierData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    carrierData = JSON.stringify(carrierData);
    return this.http.post(this.config.everestApiUrl + 'carriers', carrierData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

  /**
   * To get all exisitng riders
   */
  getRiders(): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getRiders',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }
}
