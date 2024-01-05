import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CommonPipeModule } from '../../pipes/common/common.pipes';

import { SharedComponent } from './shared.component';
import { CarrierMenuComponent } from './carrier-menu.component';
import { RiderMenuComponent } from './rider-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NguiAutoCompleteModule,
    CommonPipeModule
  ],
  declarations: [
    SharedComponent, CarrierMenuComponent, RiderMenuComponent
  ],
  exports: [
    SharedComponent, CarrierMenuComponent, RiderMenuComponent
  ]
})
export class CarrierSharedModule { }
