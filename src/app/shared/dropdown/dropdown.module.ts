import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CommonPipeModule } from '../../pipes/common/common.pipes';

import { AdminDropdownComponent } from './admin-dropdown.component';

/** Dropdown module class */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    CommonPipeModule
  ],
  declarations: [
    AdminDropdownComponent
  ],
  exports: [
    AdminDropdownComponent
  ]
})
export class DropdownModule { }
