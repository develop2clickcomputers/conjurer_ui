import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { BeforeLoginHeaderModule } from '../header/before-login-header.module';
import { BeforeLoginFooterModule } from '../footer/before-login-footer.module';
import { LoginComponent } from './login.component';
import { AppLoginRoutinModule } from './login.routes';
import { AlertServiceModule } from '../shared/alert.module';

import { CommonPipeModule } from '../pipes/common/common.pipes';
import { CommonDirectiveModule} from '../directives/common/common.directive';

/**
 * Login module class
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
    CommonPipeModule,
    CommonDirectiveModule,
    AlertServiceModule,
    AppLoginRoutinModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
