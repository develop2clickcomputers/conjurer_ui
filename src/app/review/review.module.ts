import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { MyDatePickerModule } from 'mydatepicker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { AccountHelper } from '../helpers/account/account.helper';
import { ReviewComponent } from './review.component';
import { ReviewAppRoutingModule } from './review.routes';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { PreviewPipeModule } from '../pipes/preview/preview.pipes';
import { CommonDirectiveModule } from '../directives/common/common.directive';

/**
 * Review module class
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    CommonDirectiveModule,
    PreviewPipeModule,
    MyDatePickerModule,
    NguiAutoCompleteModule,
    ReviewAppRoutingModule
  ],
  declarations: [ReviewComponent],
  exports: [ReviewComponent],
  providers: [AccountHelper]
})
export class ReviewModule { }
