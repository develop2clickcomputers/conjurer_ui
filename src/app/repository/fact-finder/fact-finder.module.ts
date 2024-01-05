import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthorisedHeaderModule } from '../../header/authorised-header.module';
import { AuthorisedFooterModule } from '../../footer/authorised-footer.module';

import { CommonPipeModule } from '../../pipes/common/common.pipes';
import { SharedModule } from '../../shared/shared.module';
import { FactFinderComponent } from './fact-finder.component';

/**
 * Fact finder module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    SharedModule
  ],
  declarations: [
    FactFinderComponent
  ],
  exports: [
    FactFinderComponent
  ]
})
export class FactFinderModule { }
