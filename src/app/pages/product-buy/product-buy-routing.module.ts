import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductBuyPage} from './product-buy.page';
import {ProductGuard} from '@core/guard/product.guard';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ShoppingCartDetailComponent } from './shopping-cart-detail/shopping-cart-detail.component';
import { LogedinGuard } from '@app/@core/guard/logedin.guard';

const routes: Routes = [
  {
    path: 'buy/:id',
    component: ProductBuyPage,
    canActivate: [LogedinGuard, ProductGuard]
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [LogedinGuard, ProductGuard]
  },
  {
    path: 'bookings/:id',
    component: BookingsComponent,
    canActivate: [LogedinGuard, ProductGuard]
  },
  {
    path: 'shopping-cart/detail/:id',
    component: ShoppingCartDetailComponent,
    canActivate: [LogedinGuard, ProductGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductBuyPageRoutingModule {
}
