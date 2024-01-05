import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { LogoutComponent } from './logout.component';

const LogoutRoutes: Routes = [
    {
        path: 'logout', component: LogoutComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(LogoutRoutes)
    ],
    exports: [RouterModule]
})
export class LogoutAppRoutingModule {  }
