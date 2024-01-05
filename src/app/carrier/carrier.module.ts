import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';

import { CarrierComponent } from './carrier.component';
import { CarrierAppRoutingModule } from './carrier.routes';
import { CarrierInformationModule } from './carrier-information/carrier-information.module';
import { PolicyInformationModule } from './policy-information/policy-information.module';
import { RiderCommissionModule } from './rider-commission/rider-commission.module';
import { CarrierHelper } from '../helpers/carrier/carrier.helper';
import { PlanModule } from './plan/plan.module';

/**
 * Carrier Module
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CarrierInformationModule,
    PolicyInformationModule,
    RiderCommissionModule,
    PlanModule,
    CarrierAppRoutingModule
  ],
  declarations: [CarrierComponent],
  exports: [CarrierComponent],
  providers: [CarrierHelper]
})
export class CarrierModule { }
