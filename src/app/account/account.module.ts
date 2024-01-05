import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { OrderModule } from 'ngx-order-pipe';

import { CommonPipeModule } from '../pipes/common/common.pipes';
import { SharedModule } from '../shared/shared.module';
import { CommonDirectiveModule } from '../directives/common/common.directive';
import { CarrierHelper } from '../helpers/carrier/carrier.helper';

import { AccountComponent } from './account.component';
import { AccountAppRoutingModule } from './account.routes';
import { CustomOutputService } from '../custom-output/custom-output.service';

/**
 * Account modal
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    OrderModule,
    CommonPipeModule,
    SharedModule,
    CommonDirectiveModule,
    AccountAppRoutingModule
  ],
  declarations: [AccountComponent],
  exports: [AccountComponent],
  providers: [
    CarrierHelper, CustomOutputService
  ]
})
export class AccountModule { }
