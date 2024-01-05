import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { BeforeLoginHeaderModule } from '../header/before-login-header.module';
import { BeforeLoginFooterModule } from '../footer/before-login-footer.module';
import { SignupComponent } from './signup.component';
import { SignupAppRoutingModule } from './signup.routes';
import { AlertServiceModule } from '../shared/alert.module';

/**
 * Signup service class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    BeforeLoginHeaderModule,
    BeforeLoginFooterModule,
    SignupAppRoutingModule,
    AlertServiceModule
  ],
  declarations: [SignupComponent],
  exports: [SignupComponent]
})
export class SignupModule { }
