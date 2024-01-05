import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { AuthenticationService } from '../services/authentication.service';
import { LogoutService } from './logout.service';

/**
 * Logout component class
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  providers: [
    LogoutService, AuthenticationService, CommonHttpAdapterService,
    RxJSHelper
  ]
})
export class LogoutComponent implements OnInit, OnDestroy {

  /** @ignore */
  constructor(
    private router: Router,
    private logoutService: LogoutService,
    private authenticationService: AuthenticationService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper
  ) { }

  /** @ignore */
  ngOnInit() {
    // calling logout methods
    this.logout();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /**
   * To logout
   */
  logout() {
    const userId = this.commonHttpAdapterService.getCurrentUserId();

    this.logoutService.logout(userId).subscribe(
      res => {
        setTimeout(() => {
          this.router.navigateByUrl('/login');
          // to clear from session storage
          this.authenticationService.logout();
        });
      },
      error => {
        setTimeout(() => {
          this.router.navigateByUrl('/login');
          // to clear from session storage
          this.authenticationService.logout();
        });
      }
    )
  }

}
