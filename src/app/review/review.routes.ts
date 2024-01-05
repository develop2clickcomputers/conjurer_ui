import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { ReviewComponent } from './review.component';

const ReviewRoutes: Routes = [
    {
        path: 'review', component: ReviewComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(ReviewRoutes)
    ],
    exports: [RouterModule]
})
export class ReviewAppRoutingModule {  }
