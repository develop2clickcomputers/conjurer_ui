import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthorisedHeaderModule } from '../../header/authorised-header.module';
import { AuthorisedFooterModule } from '../../footer/authorised-footer.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { CommonPipeModule } from '../../pipes/common/common.pipes';

import { BatchReportComponent } from './batch-report.component';
import { SharedModule } from '../../shared/shared.module';

/**
 * Batch Report Module Class
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    NgxPaginationModule,
    CommonPipeModule,
    SharedModule
  ],
  declarations: [BatchReportComponent],
  exports: [BatchReportComponent]
})
export class BatchReportModule { }
