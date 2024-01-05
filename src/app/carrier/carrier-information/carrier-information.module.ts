import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonDirectiveModule } from '../../directives/common/common.directive';
import { CommonPipeModule } from '../../pipes/common/common.pipes';
import { SharedModule } from '../../shared/shared.module';
import { CarrierSharedModule } from '../shared/shared.module';

import { CarrierInformationComponent } from './carrier-information.component';
import { CarrierPipeModule } from '../../pipes/carrier/carrier.pipes';

/**
 * Carrier Information Module Class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonDirectiveModule,
    CommonPipeModule,
    SharedModule,
    CarrierPipeModule,
    CarrierSharedModule
  ],
  declarations: [CarrierInformationComponent],
  exports: [CarrierInformationComponent]
})
export class CarrierInformationModule { }
