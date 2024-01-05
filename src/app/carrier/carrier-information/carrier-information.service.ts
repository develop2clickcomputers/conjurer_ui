import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

/**
 * Carrier Information Service Class
 */
@Injectable()
export class CarrierInformationService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get all carriers
   */
  getCarriers(): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData = JSON.stringify(userData);
    return this.http.post(this.config.everestApiUrl + 'getCarriers', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get carrier information by Id
   * @param string carrierId
   */
  getCarrierById(carrierId: string): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CarrierConstant.CARRIER_ID] = carrierId;
    userData = JSON.stringify(userData);
    return this.http.post(this.config.everestApiUrl + 'getCarrierById', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit contact information
   * @param any data
   */
  submitContactInformation(data: any): Observable<any[]> {
    return this.http.post(this.config.everestApiUrl + 'addCarrier', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update carrier information
   * @param any data
   */
  updateCarrierInfo(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updateCarrier', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * Scrapped insurance data functionality
   */

  /**
   * To get insurance(carrier) data from aca service
   * @param data
   */
  getInsuranceData(): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getInsuranceData', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get carrier contact details
   * @param carrierName
   */
  getInstituteDetails(carrierName?): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (carrierName) {
      userData[CommonConstant.NAME] = carrierName;
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getInstituteDetails', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update scraped carrier information
   * @param data
   */
  updateInstituteDetails(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updateInstituteDetails', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get plan data by id
   * @param data
   */
  getInstitutionDetailsById(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getInstitutionDetailsById', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get plan data by id
   * @param data
   */
  getInsurancePlans(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getInsurancePlans', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To purchase plan
   * @param data
   */
  purchasePlan(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'purchasePlan', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
