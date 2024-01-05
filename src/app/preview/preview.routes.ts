import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';

import { PreviewComponent } from './preview.component';

const PreviewRoutes: Routes = [
    {
        path: 'preview', component: PreviewComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(PreviewRoutes)
    ],
    exports: [RouterModule]
})
export class PreviewAppRoutingModule {  }

