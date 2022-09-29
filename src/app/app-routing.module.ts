import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LogedinGuard} from '@core/guard/logedin.guard';
import { SellerGuard } from './@core/guard/seller.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'add-lot',
    loadChildren: () => import('./pages/add-lot/add-lot.module').then(m => m.AddLotPageModule),
    canActivate: [LogedinGuard]
  },
  {
    path: 'share',
    loadChildren: () => import('./pages/share/share.module').then(m => m.ShareModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product-buy/product-buy.module').then(m => m.ProductBuyPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule),
    canActivate: [LogedinGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule),
    canActivate: [LogedinGuard]
  },
  {
    path: 'barn',
    loadChildren: () => import('./pages/barn/barn.module').then( m => m.BarnPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule),
    canActivate: [LogedinGuard]
  },
  {
    path: 'convert-units',
    loadChildren: () => import('./pages/convert-units/convert-units.module').then( m => m.ConvertUnitsPageModule)
  },
  {
    path: 'lot-list',
    loadChildren: () => import('./pages/lot-list/lot-list.module').then( m => m.LotListPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
    canActivate: [LogedinGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
