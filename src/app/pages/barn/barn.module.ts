import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarnPageRoutingModule } from './barn-routing.module';

import { BarnPage } from './barn.page';
import { ShareModule } from '../share/share.module';
import { BarnDetailComponent } from './barn-detail/barn-detail.component';
import { BarnListComponent } from './barn-list/barn-list.component';
import { BarnOrderComponent } from './barn-order/barn-order.component';
import { CatologDetailComponent } from './catolog-detail/catolog-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShareModule,
    BarnPageRoutingModule
  ],
  declarations: [BarnPage, BarnDetailComponent, BarnListComponent, BarnOrderComponent, CatologDetailComponent]
})
export class BarnPageModule {}
