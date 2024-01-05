import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { AuthGuard } from '../guards/auth.guards';

const AccountRoutes: Routes = [
    {
        path: 'overview', component: AccountComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(AccountRoutes)
    ],
    exports: [RouterModule]
})
export class AccountAppRoutingModule {  }
