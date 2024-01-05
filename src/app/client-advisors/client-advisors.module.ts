import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAdvisorsComponent } from './client-advisors.component';
import { RouterModule } from '@angular/router';
import { ClientAdvisorsAppRoutingModule } from './client-advisors.routes';
import { AccountService } from '../account/account.service';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '../shared/shared.module';

/**
 * Client advisor module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    OrderModule,
    SharedModule,
    ClientAdvisorsAppRoutingModule
  ],
  declarations: [ClientAdvisorsComponent],
  exports: [
    ClientAdvisorsComponent
  ],
  providers: [
    AccountService, CommonHttpAdapterService
  ]
})
export class ClientAdvisorsModule { }
