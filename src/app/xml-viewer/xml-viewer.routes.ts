import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { XMLViewerComponent } from './xml-viewer.component';

const ReviewRoutes: Routes = [
    {
        path: 'xmlview', component: XMLViewerComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(ReviewRoutes)
    ],
    exports: [RouterModule]
})
export class XMLViewerAppRoutingModule {  }
