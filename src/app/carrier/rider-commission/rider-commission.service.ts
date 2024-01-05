import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';
import { CarrierHelper } from '../../helpers/carrier/carrier.helper';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

/**
 * Rider commission service class
 */
@Injectable()
export class RiderCommissionService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private carrierHelper: CarrierHelper,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get the rider commission
   * @param data
   */
  getRiderCommission(policyPlanId?): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CarrierConstant.CARRIER_ID] = this.carrierHelper.getCarrierId();
    userData[CommonConstant.PLAIN_ID] = policyPlanId;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getRiderCommissionRates', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get the rider commission
   * @param data
   */
  getPlanRiders(planId?): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    // userData[CarrierConstant.CARRIER_ID] = this.carrierHelper.getCarrierId();
    if (planId) {
      userData[CommonConstant.PLAIN_ID] = planId;
    } else {
      userData[CommonConstant.PLAIN_ID] = this.carrierHelper.getPolicyInfoId();
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getPolicyPlanRidersById', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get the rider details by policy plan rider id
   * @param data
   */
  getPolicyPlanRiderDetails(policyplanRiderId): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CarrierConstant.POLICY_PLAN_ID] = this.carrierHelper.getPolicyInfoId();
    userData[CommonConstant.PLAIN_ID] = policyplanRiderId;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getPolicyPlanRiderDetailsByPolicyplanRiderId',
      userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit rider commission
   * @param data
   */
  submitRiderCommission(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'addRiderCommissionRate', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit rider commission
   * @param data
   */
  submitPlanRider(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'addPolicyPlanRider', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update rider commission
   * @param data
   */
  updateRiderCommission(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updateRiderComm', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get rider commission plan type
   */
  getRiderCommPlanType(): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getPolicyPlanType', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To add new commission rates for insurance data
   * @param data
   */
  addInsurancePlanRiderCommissionRate(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'addInsurancePlanRiderCommissionRate', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * Get rider commission rates for scraped plan rider
   * @param data
   */
  getPlanRiderCommissionRates(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getInsuranceRiderCommissionRates', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
