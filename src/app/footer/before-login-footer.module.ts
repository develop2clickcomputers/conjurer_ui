import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeforeLoginFooterComponent } from './before-login-footer.component';

/**
 * Before Login footer module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BeforeLoginFooterComponent],
  exports: [BeforeLoginFooterComponent]
})
export class BeforeLoginFooterModule { }
