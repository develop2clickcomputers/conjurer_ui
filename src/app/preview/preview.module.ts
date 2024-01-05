import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { MyDatePickerModule } from 'mydatepicker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { AccountHelper } from '../helpers/account/account.helper';

import { PreviewComponent } from './preview.component';
import { PreviewAppRoutingModule } from './preview.routes';
import { ClickOutsideDirective, PreviewDirective } from './preview.directive';

import { PreviewPipeModule } from '../pipes/preview/preview.pipes';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { CommonDirectiveModule } from '../directives/common/common.directive';
import { CommonHelperService } from '../helpers/common/common.helper';

/**
 * Preview module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    PreviewPipeModule,
    CommonDirectiveModule,
    MyDatePickerModule,
    NguiAutoCompleteModule,
    PreviewAppRoutingModule
  ],
  declarations: [
    PreviewComponent, ClickOutsideDirective, PreviewDirective
  ],
  exports: [PreviewComponent],
  providers: [AccountHelper, CommonHelperService]
})
export class PreviewModule { }
