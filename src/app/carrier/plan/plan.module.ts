import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthorisedHeaderModule } from '../../header/authorised-header.module';
import { AuthorisedFooterModule } from '../../footer/authorised-footer.module';

import { PlanComponent } from './plan.component';
import { PolicyInformationModule } from '../../carrier/policy-information/policy-information.module';
import { RiderCommissionModule } from '../../carrier/rider-commission/rider-commission.module';

/**
 * Plan module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    PolicyInformationModule,
    RiderCommissionModule
  ],
  declarations: [PlanComponent],
  exports: [PlanComponent]
})
export class PlanModule { }
