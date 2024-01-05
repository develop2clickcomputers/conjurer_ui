import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TooltipModule } from 'ngx-tooltip';
import { PopoverModule } from 'ngx-popover';
import { OrderModule } from 'ngx-order-pipe';
import { CommonPipeModule } from '../pipes/common/common.pipes';
import { CommonDirectiveModule } from '../directives/common/common.directive';

import { CommonNotificationComponent } from './notification.component';
import { NewPolicyComponent } from './policy/new-policy.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { DeleteComponent } from './delete/delete.component';

/**
 * Shared module class for this applicaiton
 */
@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, FormsModule,
        MyDatePickerModule, NguiAutoCompleteModule, TooltipModule, PopoverModule,
        OrderModule, CommonPipeModule, CommonDirectiveModule
    ],
    declarations: [
        CommonNotificationComponent, NewPolicyComponent, DropdownComponent, DeleteComponent
    ],
    exports: [
        CommonNotificationComponent, NewPolicyComponent, DropdownComponent, DeleteComponent
    ],
})
export class SharedModule {  }
