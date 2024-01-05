import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BeforeLoginHeaderComponent } from './before-login-header.component';

/**
 * Before login header module
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [BeforeLoginHeaderComponent],
  exports: [BeforeLoginHeaderComponent]
})
export class BeforeLoginHeaderModule { }
