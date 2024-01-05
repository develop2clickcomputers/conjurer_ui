import { NgModule, Injectable, InjectionToken } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { CommonConstant } from '../constants/common/common.constant';
import { APP_DI_CONFIG } from '../app-config';
import { AlertService } from '../services/alert.service';

/** Injection token for adapter service */
export let K2_APP_HTTP_ADAPTER = new InjectionToken<CommonHttpAdapterService>('app.config');

/**
 * Common Http Service class
 */
@Injectable()
export class CommonHttpAdapterService {

  /** @ignore */
  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  /**This function is used to add header to all api */
  public jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser || currentUser[CommonConstant.AUTH_TOKEN]) {
      // tslint:disable-next-line:max-line-length
      const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentUser[CommonConstant.AUTH_TOKEN] }) };
      console.log(":jwt:headers:"+headers);
      return headers;
    }
  }

  /**To set normal headers */
  public headerOptions() {
     const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authkey': APP_DI_CONFIG.authkey }) };
     return headers;
   }

  /* public SSOJwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser || currentUser[CommonConstant.AUTH_TOKEN]) {
      const headers = new Headers({ 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + currentUser[CommonConstant.AUTH_TOKEN], 'authkey': APP_DI_CONFIG.authkey });
      return new RequestOptions({ method: RequestMethod.Post, headers: headers });
    }
  } */

  /**
   * To set header for SSO
   */
  public SSOJwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser || currentUser[CommonConstant.AUTH_TOKEN]) {

      const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + currentUser[CommonConstant.AUTH_TOKEN], 'authkey': APP_DI_CONFIG.authkey }) };
      return headers;
    }
  }

  /**To get current user details */
  public getCurrentUser() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser[CommonConstant.AUTH_TOKEN]) {
      return currentUser;
    }
  }

  /**To get current userId */
  public getCurrentUserId() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser[CommonConstant.AUTH_TOKEN]) {
      return currentUser.userId;
    }
  }

  /**To get username */
  public getCurrentUsername() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser[CommonConstant.AUTH_TOKEN]) {
      return currentUser.username;
    }
  }

  /**To get auth token */
  public getCurrentAuthToken() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser[CommonConstant.AUTH_TOKEN]) {
      return currentUser[CommonConstant.AUTH_TOKEN];
    }
  }

  /**To get current user role */
  public getCurrentUserRole() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser[CommonConstant.AUTH_TOKEN]) {
      return currentUser.userRole;
    }
  }

  /**
   * To make request structure with userid only
   */
  public getUserIdResponseStructure() {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.getCurrentUserId();
    userData = JSON.stringify(userData);

    return userData;
  }

  /**
   * To handle common success response for all api's
   * @param res
   */
  public extractData(res: Response | any) {
    return res || {};
  }

  /**
   * To handle common error response for all api's
   * @param error
   */
  /* public handleError(error: Response | any) {
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
  } */

  /**
   * To handle error
   * @param Response error
   */
  public handleError(error: Response| any) {
    // console.log(error);
    // In a real world app, we might use a remote logging infrastructure
    if (environment.production) {
      if (error.status === 401 || error.status === 0) {
        setTimeout(() => {
          this.redirectToLoginPage();
        }, 300);
      }
    }
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

  /**
   * To logout
   */
  redirectToLoginPage() {
    this.router.navigateByUrl('logout');
    /* setTimeout(() => {
      this.router.navigateByUrl('login');
      this.alertService.success('You have been logged out', true);
    }, 200); */
  }

}

/**
 * Common HTTP module class
 */
@NgModule({
  providers: [
    { provide: K2_APP_HTTP_ADAPTER, useClass: CommonHttpAdapterService },
    AlertService
  ]
})
export class CommonHttpAdapterModule { }
