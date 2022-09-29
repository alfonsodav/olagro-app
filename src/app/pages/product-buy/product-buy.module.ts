import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductBuyPageRoutingModule } from './product-buy-routing.module';

import { ProductBuyPage } from './product-buy.page';
import {ShareModule} from '@app/pages/share/share.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { BookingsComponent } from './bookings/bookings.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ShoppingCartDetailComponent } from './shopping-cart-detail/shopping-cart-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductBuyPageRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyModule
  ],
  declarations: [ProductBuyPage, ShoppingCartComponent, BookingsComponent, ShoppingCartDetailComponent]
})
export class ProductBuyPageModule {}
