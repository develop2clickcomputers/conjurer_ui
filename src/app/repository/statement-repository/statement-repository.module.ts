import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthorisedHeaderModule } from '../../header/authorised-header.module';
import { AuthorisedFooterModule } from '../../footer/authorised-footer.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { CommonPipeModule } from '../../pipes/common/common.pipes';

import { StatementRepositoryComponent } from './statement-repository.component';

/**
 * Statement Repository Module Class
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    NgxPaginationModule,
    CommonPipeModule
  ],
  declarations: [StatementRepositoryComponent],
  exports: [StatementRepositoryComponent]
})
export class StatementRepositoryModule { }
