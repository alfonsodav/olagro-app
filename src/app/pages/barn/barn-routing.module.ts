import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogedinGuard } from '@app/@core/guard/logedin.guard';
import { SellerGuard } from '@app/@core/guard/seller.guard';
import { BarnDetailComponent } from './barn-detail/barn-detail.component';
import { BarnListComponent } from './barn-list/barn-list.component';
import { BarnOrderComponent } from './barn-order/barn-order.component';

import { BarnPage } from './barn.page';
import { CatologDetailComponent } from './catolog-detail/catolog-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BarnPage
  },
  {
    path: 'detail',
    component: BarnDetailComponent,
    canActivate: [LogedinGuard, SellerGuard]
  },
  {
    path: 'detail/:id',
    component: BarnDetailComponent,
    canActivate: [LogedinGuard]
  },
  {
    path: 'catalogue',
    component: BarnListComponent
  },
  {
    path: 'catalogue/detail',
    component: CatologDetailComponent,
    canActivate: [LogedinGuard]
  },
  {
    path: 'order',
    component: BarnOrderComponent,
    canActivate: [LogedinGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarnPageRoutingModule { }
