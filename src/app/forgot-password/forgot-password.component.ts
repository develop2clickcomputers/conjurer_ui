import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { AlertService } from '../services/alert.service';
import { CommonConstant } from '../constants/common/common.constant';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonService } from '../services/common/common.service';
import { CommonHelperService } from '../helpers/common/common.helper';

/** Jquery Integration */
declare var $: any;

/**
 * Forgot password component class
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [
    CommonHttpAdapterService, CommonService, AlertService,
    CommonHelperService, RxJSHelper
  ]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  public forgotPasswordForm: FormGroup;
  public user: any = {};
  public dataLoading = false;

  /** @ignore */
  constructor(
    private _fb: FormBuilder,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonService: CommonService,
    private router: Router,
    private alertService: AlertService,
    private commonHelperService: CommonHelperService,
    private rxjsHelper: RxJSHelper
  ) { }

  /** @ignore */
  ngOnInit() {
    this.createForgotPasswordForm();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /** To create forgot password form */
  createForgotPasswordForm() {
    return this.forgotPasswordForm = this._fb.group({
      email: ['' , [Validators.required, Validators.pattern(this.commonHelperService.emailPattern)]],
    });
  }

  /**
   * To send an email to the registered email address
   */
  forgotpassword() {
    document.getElementById('forgotPasswordError').innerHTML = '';
    const email = this.forgotPasswordForm.get('email').value;
    if (!email) {
      document.getElementById('forgotPasswordError').innerHTML = 'Email address can not be empty';
      return;
    }
    // const email = this.user['email'];
    let userData: any = {};
    if (email) {
      userData[CommonConstant.EMAIL] = email;
      userData[CommonConstant.PLATFORM] = CommonConstant.PLATFORM_NAME;
      userData = JSON.stringify(userData);
      this.dataLoading = true;
      this.commonService.forgotPassword(userData).subscribe(
        res => {
          this.dataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.router.navigateByUrl('login');
            setTimeout(() => {
              this.alertService.success(res[CommonConstant.MESSAGE]);
            }, 300);
          } else {
            this.alertService.error(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.dataLoading = false;
          this.alertService.error('Something went wrong..Please try agian');
        }
      )
    }
  }

  /** Redirect to login page */
  redirectToLoginPage() {
    this.router.navigateByUrl('/login');
  }

}

/**
 * Reset password component class
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [
    CommonHttpAdapterService, CommonService, AlertService,
    RxJSHelper
  ]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public resetPasswordForm: FormGroup;
  public user: any = {};
  public dataLoading = false;

  /** @ignore */
  constructor(
    private _fb: FormBuilder,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private commonHelperService: CommonHelperService,
    private rxjsHelper: RxJSHelper
  ) { }

  /** @ignore */
  ngOnInit() {
    this.createResetPasswordForm();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /**
   * To create reset password form
   */
  createResetPasswordForm() {
    this.resetPasswordForm = this._fb.group({
      newPassword: ['' , [Validators.required, Validators.pattern(this.commonHelperService.pwdPattern)]],
      confirmPassword: ['',  [Validators.required, Validators.pattern(this.commonHelperService.pwdPattern)]]
    })
  }

  /**
   * To reset password
   */
  resetPassword() {
    document.getElementById('forgotPasswordError').innerHTML = '';
    const newPassword = this.resetPasswordForm.get('newPassword').value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword').value;
    if (!newPassword) {
      document.getElementById('forgotPasswordError').innerHTML = 'Password can not be empty';
      return;
    }
    if (!confirmPassword) {
      document.getElementById('forgotPasswordError').innerHTML = 'Confirm password can not be empty';
      return;
    }
    if (newPassword !== confirmPassword) {
      document.getElementById('forgotPasswordError').innerHTML = 'Password and confirm password should be same';
      return;
    }

    let userData: any = {};
    const username = this.activatedRoute.snapshot.params['username'];
    const timestamp = this.activatedRoute.snapshot.params['timestamp'];
    userData[CommonConstant.USERNAME] = username;
    userData[CommonConstant.TIMESTAMP] = timestamp;
    userData[CommonConstant.PLATFORM] = CommonConstant.PLATFORM_NAME;
    userData[CommonConstant.PASSWORD] = newPassword;

    userData = JSON.stringify(userData);
    this.dataLoading = true;
    this.commonService.resetPassword(userData).subscribe(
      res => {
        this.dataLoading = false;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.router.navigateByUrl('login');
          setTimeout(() => {
            this.alertService.success(res[CommonConstant.MESSAGE]);
          }, 200);
        } else {
          this.alertService.error(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.dataLoading = false;
        this.alertService.error('Something went wrong..Please try again');
      }
    )
  }

  /** Redirect to login page */
  redirectToLoginPage() {
    this.router.navigateByUrl('/login');
  }

  /**
   * To check password validation
   */
  checkPasswordValidation() {

    const input_value = $('#newPassword').val();

    const onlyNumber = /.*[0-9].*/;
    const smallCase = /.*[a-z].*/;
    const upperCase = /.*[A-Z].*/;
    const supportedSpecialChar = /.*[$@$!%*?&#~^].*/;

    // For number rangeChar
    if (input_value.length >= 8 && input_value.length <= 20) {
      $('#rangeChar').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
    } else {
      $('#rangeChar').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
    }

    // For Number Checking at least one
    if (onlyNumber.test(input_value)) {
      $('#onenumber').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
    } else {
      $('#onenumber').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
    }

    // For lowercase char Checking at least one
    if (smallCase.test(input_value)) {
      $('#onelower').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
    } else {
      $('#onelower').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
    }

    // For Uppercase char Checking at least one
    if (upperCase.test(input_value)) {
      $('#oneupper').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
    } else {
      $('#oneupper').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
    }

    // For Special Character Checking at least one
    if (supportedSpecialChar.test(input_value)) {
      $('#onesplchar').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
    } else {
      $('#onesplchar').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
    }
  }

}
