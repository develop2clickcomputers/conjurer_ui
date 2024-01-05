import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomOutputComponent } from './custom-output.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomOutputService } from './custom-output.service';
import { FormHelper } from '../helpers/form/form.helper';
import { SharedModule } from '../shared/shared.module';
import { PopoverModule } from 'ngx-popover';
import { CommonDirectiveModule } from '../directives/common/common.directive';

/**
 * Custom ouptput header module class
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonDirectiveModule,
    PopoverModule
  ],
  declarations: [
    CustomOutputComponent
  ],
  exports: [
    CustomOutputComponent
  ],
  providers: [
    CustomOutputService, FormHelper
  ]
})
export class CustomOutputModule { }
