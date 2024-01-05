import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { ClientAdvisorsComponent } from './client-advisors.component';

const ClientAdvisorsRoutes: Routes = [
    {
        path: 'advisors', component: ClientAdvisorsComponent,
        canActivate: [AuthGuard]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(ClientAdvisorsRoutes)
    ],
    exports: [RouterModule]
})
export class ClientAdvisorsAppRoutingModule {  }
