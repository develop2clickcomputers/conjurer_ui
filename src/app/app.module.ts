import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppConfigModule } from './app-config';
import { CommonHttpAdapterModule } from './adapters/common-http-adapter.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { AuthGuard } from './guards/auth.guards';

import { Logger } from './shared/logger.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalConfig } from './shared/common/modal.config';
import { ChartConfig } from './shared/common/chart.config';
import { RxJSHelper } from './helpers/rxjs-helper/rxjs.helper';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { LogoutModule } from './logout/logout.module';
import { AccountModule } from './account/account.module';
import { PreviewModule } from './preview/preview.module';
import { ReviewModule } from './review/review.module';
import { RepositoryModule } from './repository/repository.module';
import { InvestmentModule } from './investment/investment.module';

import { PageNotFoundComponent } from './shared/page-not-found.component';
import { XmlViewerModule } from './xml-viewer/xml-viewer.module';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { CarrierModule } from './carrier/carrier.module';
import { ClientAdvisorsModule } from './client-advisors/client-advisors.module';

/**
 * App Module
 */
@NgModule({
  declarations: [
    AppComponent, PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppConfigModule,
    CommonHttpAdapterModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    LoginModule,
    SignupModule,
    LogoutModule,
    ForgotPasswordModule,
    AccountModule,
    PreviewModule,
    ReviewModule,
    RepositoryModule,
    InvestmentModule,
    TransactionModule,
    BudgetModule,
    XmlViewerModule,
    CarrierModule,
    ClientAdvisorsModule,
    AppRoutingModule
  ],
  providers: [AuthGuard, Logger, ModalConfig, ChartConfig, RxJSHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
