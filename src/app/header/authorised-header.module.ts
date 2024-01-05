import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-tooltip';
import { PopoverModule } from 'ngx-popover';

import { AuthorisedHeaderComponent } from './authorised-header.component';
import { SharedModule } from '../shared/shared.module';
import { CustomOutputModule } from '../custom-output/custom-output.module';

/**
 * After login header module class
 */
@NgModule({
    imports: [
        CommonModule, RouterModule, FormsModule, ReactiveFormsModule,
        SharedModule, TooltipModule, PopoverModule, CustomOutputModule
    ],
    declarations: [AuthorisedHeaderComponent],
    exports: [AuthorisedHeaderComponent]
})
export class AuthorisedHeaderModule {  }
