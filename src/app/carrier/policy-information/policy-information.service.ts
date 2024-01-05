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
 * Plan Information service class
 */
@Injectable()
export class PolicyInformationService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private carrierHelper: CarrierHelper,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get policies information
   * @param data
   */
  getPolicyInformation(carrierId?): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (carrierId) {
      userData[CarrierConstant.CARRIER_ID] = carrierId;
    } else {
      userData[CarrierConstant.CARRIER_ID] = this.carrierHelper.getCarrierId();
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getPolicyPlans', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get policies information by policy id
   * @param data
   */
  getPolicyInformationById(policyId): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CarrierConstant.CARRIER_ID] = this.carrierHelper.getCarrierId();
    userData[CommonConstant.PLAIN_ID] = policyId;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getPolicyPlanById', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit policy information
   * @param data
   */
  submitPolicyInformation(data: any): Observable<any[]> {
    return this.http.post(this.config.everestApiUrl + 'addPolicyPlan', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update policy information
   * @param data
   */
  updatePolicyPlan(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updatePolicyPlan', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all rider lists
   */
  getRiders(): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getRiderList',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


  /**
   * To submit policy information
   * @param data
   */
  submitNewPlanInfo(data: any): Observable<any[]> {
    return this.http.post(this.config.everestApiUrl + 'copyAndCreatePolicyPlan', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit the policy commission information for insurance data
   * @param data
   */
  updateInstitutePlans(data): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updateInstitutePlans', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
