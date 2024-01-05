import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';

import { CommonPipeModule } from '../../pipes/common/common.pipes';
import { SharedModule } from '../../shared/shared.module';

import { RiderCommissionComponent } from './rider-commission.component';
import { CarrierSharedModule } from '../shared/shared.module';
import { CarrierInformationService } from '../carrier-information/carrier-information.service';

/**
 * Rider commission module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    CommonPipeModule,
    SharedModule,
    CarrierSharedModule
  ],
  declarations: [RiderCommissionComponent],
  exports: [RiderCommissionComponent],
  providers: [
    CarrierInformationService
  ]
})
export class RiderCommissionModule { }
