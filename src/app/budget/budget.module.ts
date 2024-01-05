import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { CommonDirectiveModule } from '../directives/common/common.directive';
import { SharedModule } from '../shared/shared.module';
import { OrderModule } from 'ngx-order-pipe';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { BudgetComponent } from './budget.component';
import { BudgetAppRoutingModule } from './budget.routes';

/**
 * Budget module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    CommonDirectiveModule,
    SharedModule,
    OrderModule,
    NguiAutoCompleteModule,
    MyDatePickerModule,
    NgxPaginationModule,
    BudgetAppRoutingModule
  ],
  declarations: [BudgetComponent],
  exports: [BudgetComponent]
})
export class BudgetModule { }
