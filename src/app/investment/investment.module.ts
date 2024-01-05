import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { PreviewPipeModule } from '../pipes/preview/preview.pipes';
import { CommonDirectiveModule } from '../directives/common/common.directive';
import { SharedModule } from '../shared/shared.module';
import { OrderModule } from 'ngx-order-pipe';

import { InvestmentComponent } from './investment.component';
import { InvestmentAppRoutingModule } from './investment.routes';

/**
 * Investment module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    NgxPaginationModule,
    CommonPipeModule,
    PreviewPipeModule,
    CommonDirectiveModule,
    SharedModule,
    OrderModule,
    // PapaParseModule,
    InvestmentAppRoutingModule
  ],
  declarations: [InvestmentComponent],
  exports: [InvestmentComponent]
})
export class InvestmentModule { }
