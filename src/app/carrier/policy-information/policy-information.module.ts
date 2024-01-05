import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { CommonPipeModule } from '../../pipes/common/common.pipes';
import { PolicyInformationComponent } from './policy-information.component';
import { CarrierSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../shared/shared.module';
import { CarrierInformationService } from '../carrier-information/carrier-information.service';
import { ClientHelper } from '../../helpers/client/client.helper';
import { OrderModule } from 'ngx-order-pipe';
import { CommonDirectiveModule } from '../../directives/common/common.directive';

/**
 * Plan information module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    OrderModule,
    CommonPipeModule,
    CommonDirectiveModule,
    SharedModule,
    CarrierSharedModule
  ],
  declarations: [PolicyInformationComponent],
  exports: [PolicyInformationComponent],
  providers: [
    CarrierInformationService, ClientHelper
  ]
})
export class PolicyInformationModule { }
