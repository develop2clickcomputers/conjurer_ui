import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { CommonHelperService } from '../helpers/common/common.helper';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { LoginService } from './login.service';

import * as Chart from 'chart.js';

import { CommonConstant } from '../constants/common/common.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/**
 * Login component class
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AuthenticationService, AlertService, LoginService,
    CommonHelperService, RxJSHelper
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  /** user object */
  user: any = {};

  /** To hide and show recaptcha */
  showRecaptcha = false;

  /**
   * Login component class dependencies
   * @param ActivatedRoute route
   * @param Router router
   * @param AuthenticationService authenticationService
   * @param AlertService alertService
   * @param LoginService loginService
   * @param CommonHelperService commonHelperService
   * @param RxJSHelper rxjsHelper
   * @param Ng4LoadingSpinnerService loaderService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private loginService: LoginService,
    private commonHelperService: CommonHelperService,
    private rxjsHelper: RxJSHelper,
    private loaderService: Ng4LoadingSpinnerService
  ) { }

  /** @ignore */
  ngOnInit() {
    this.loaderService.hide();
    this.hideRecaptchForLocal();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /**
   * To hide recaptcha in development mode
   */
  hideRecaptchForLocal() {
    if (environment.production) {
      this.showRecaptcha = true;
    } else {
      this.showRecaptcha = false;
    }
  }

  /**
   * To login into wealth management
   */
  login() {
    // console.log(this);
    if (this.user) {
      this.loginService.login(this.user.username, this.user.password).subscribe(
        data => {
          if (data[CommonConstant.ERROR_CODE] === 0) {
            // To store credential to session storage
            this.authenticationService.setSessionData(data);
            this.commonHelperService.setPreferredCurrency(data[CommonConstant.PREFERRED_CURRENCY]);

            setTimeout(() => {
              this.router.navigateByUrl('overview');
            });
          } else {
            this.alertService.error(data.message);
          }
        },
        error => {
          console.log(error);
          this.alertService.error('Something went wrong');
        });
    }
  }

  /**
   * To test the backend service
   */
  testBackendAPI(): void {
    this.loginService.checkBackendAPI().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To show center label text in chart js
   */
  registerChartJsService() {
    // to show the center level value chartjs
    Chart.pluginService.register({
      afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
          const helpers = Chart.helpers;
          const centerConfig = chart.config.options.elements.center;
          const globalConfig = Chart.defaults.global;
          const ctx = chart.chart.ctx;

          const fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
          const fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
          let fontSize;
          if (centerConfig.fontSize) {
            fontSize = centerConfig.fontSize;
          } else {  // figure out the best font size, if one is not specified
            ctx.save();
            fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
            const maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
            const maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

            do {
              ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
              const textWidth = ctx.measureText(maxText).width;

              // check if it fits, is within configured limits and that we are not simply toggling back and forth
              if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize) {
                fontSize += 1;
              } else {
                // reverse last step
                fontSize -= 1;
                break;
              }
            } while (true)
            ctx.restore();
          }

          // save properties
          chart.center = {
            font: helpers.fontString(fontSize, fontStyle, fontFamily),
            fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
          };
        }
      },
      afterDraw: function (chart, easingValue) {
        if (chart.center) {
          const centerConfig = chart.config.options.elements.center;
          const ctx = chart.chart.ctx;

          ctx.save();
          ctx.font = chart.center.font;
          ctx.fillStyle = chart.center.fillStyle;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          const txt = centerConfig.text;
          const lineheight = 17;
          let lines = '';
          lines = txt.split('<br />');

          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], centerX, centerY + (i * lineheight));
          }
          ctx.restore();
        }

      }
    })
  }

}
