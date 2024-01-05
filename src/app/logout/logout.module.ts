import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { LogoutComponent } from './logout.component';
import { LogoutAppRoutingModule } from './logout.routes';

/**
 * Logout Module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LogoutAppRoutingModule
  ],
  declarations: [LogoutComponent],
  exports: [LogoutComponent],
  providers: [AuthenticationService]
})
export class LogoutModule { }
