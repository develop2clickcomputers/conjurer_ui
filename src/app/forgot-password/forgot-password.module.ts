import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BeforeLoginHeaderModule } from '../header/before-login-header.module';
import { BeforeLoginFooterModule } from '../footer/before-login-footer.module';
import { AlertServiceModule } from '../shared/alert.module';
import { PopoverModule } from 'ngx-popover';

import { ForgotPasswordComponent, ResetPasswordComponent } from './forgot-password.component';
import { AppForgotPasswordRoutinModule } from './forgot-password.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    BeforeLoginHeaderModule,
    BeforeLoginFooterModule,
    AlertServiceModule,
    AppForgotPasswordRoutinModule
  ],
  declarations: [
    ForgotPasswordComponent, ResetPasswordComponent
  ],
  exports: [
    ForgotPasswordComponent, ResetPasswordComponent
  ]
})
export class ForgotPasswordModule { }
