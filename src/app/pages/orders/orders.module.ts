import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import {ShareModule} from '@app/pages/share/share.module';
import {OrderDetailComponent} from '@app/pages/orders/order-detail/order-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrdersPageRoutingModule,
        ShareModule
    ],
  declarations: [OrdersPage, OrderDetailComponent]
})
export class OrdersPageModule {}
