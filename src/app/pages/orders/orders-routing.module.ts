import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrderDetailComponent} from '@app/pages/orders/order-detail/order-detail.component';
import {OrdersPage} from './orders.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  },
  {
    path: 'detail/:id',
    component: OrderDetailComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {
}
